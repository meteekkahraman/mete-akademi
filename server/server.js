const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const helmet = require('helmet'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// --- MONGODB BAĞLANTISI ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Bağlantısı Başarılı!"))
  .catch(err => console.log("❌ Bağlantı Hatası:", err));

// --- MODELLER ---
const UserSchema = new mongoose.Schema({ 
  username: { type: String, required: true, unique: true }, 
  firstName: String, lastName: String, email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, role: { type: String, default: 'student' },
  xp: { type: Number, default: 0 }, title: { type: String, default: 'Çaylak' },
  friends: [{ type: String }],
  currentRoom: { id: { type: String, default: 'offline' }, topic: { type: String, default: '' }, enteredAt: { type: Date, default: null } },
  isBanned: { type: Boolean, default: false },
  lastLogin: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// YENİ: Konu Çalışma Geçmişi (Tarihli Soru Takibi İçin)
const TopicLogSchema = new mongoose.Schema({
  username: String,
  lesson: String,
  topic: String,
  count: Number,
  date: String, // YYYY-MM-DD formatında tutacağız
  timestamp: { type: Date, default: Date.now }
});
const TopicLog = mongoose.model('TopicLog', TopicLogSchema);

// Konu İlerleme Durumu (Tik Kutusu)
const ProgressSchema = new mongoose.Schema({ 
  username: String, lesson: String, topic: String, isCompleted: { type: Boolean, default: false } 
});
const Progress = mongoose.model('Progress', ProgressSchema);

// Diğer Modeller
const StudyLog = mongoose.model('StudyLog', new mongoose.Schema({ username: String, lesson: String, topic: String, type: String, duration: Number, date: String, timestamp: { type: Date, default: Date.now } }));
const Post = mongoose.model('Post', new mongoose.Schema({ username: String, content: String, date: { type: Date, default: Date.now }, isSystem: { type: Boolean, default: false } }));
const Exam = mongoose.model('Exam', new mongoose.Schema({ username: String, lesson: String, topic: String, net: Number, date: String })); // topic eklenebilir ama şimdilik standart
const Program = mongoose.model('Program', new mongoose.Schema({ username: String, day: String, time: String, lesson: String, topic: String }));
const Question = mongoose.model('Question', new mongoose.Schema({ username: String, lesson: String, topic: String, count: Number, date: String, timestamp: { type: Date, default: Date.now } }));


// --- ROTALAR ---

// 1. YENİ GELİŞMİŞ KONU TAKİP SİSTEMİ
// A. İlerlemeleri Getir
app.get('/api/progress', async (req, res) => { 
  res.json(await Progress.find({ username: req.query.username })); 
});

// B. Konuyu İşaretle (Tik At / Kaldır)
app.post('/api/progress', async (req, res) => {
    const { username, lesson, topic } = req.body;
    const existing = await Progress.findOne({ username, lesson, topic });
    
    if (existing) {
        // Varsa durumunu tersine çevir (Check <-> Uncheck)
        existing.isCompleted = !existing.isCompleted;
        await existing.save();
        res.json({ status: existing.isCompleted ? 'completed' : 'removed' });
    } else {
        // Yoksa yeni oluştur ve tamamlandı yap
        await new Progress({ username, lesson, topic, isCompleted: true }).save();
        res.json({ status: 'completed' });
    }
});

// C. Konu Geçmişi Ekle (Soru Sayısı & Tarih)
app.post('/api/topic/log', async (req, res) => {
  const { username, lesson, topic, count, date } = req.body;
  await new TopicLog({ username, lesson, topic, count, date }).save();
  
  // Kullanıcıya XP verelim (Motivasyon)
  const user = await User.findOne({ username });
  if (user) {
      user.xp += Math.floor(count * 0.5); // Her soru için 0.5 XP
      await user.save();
  }
  res.json({ msg: "Log başarıyla eklendi" });
});

// D. Konu Geçmişini Getir (Rapor İçin)
app.get('/api/topic/logs', async (req, res) => {
  const { username, lesson, topic } = req.query;
  // Tarihe göre yeniden eskiye sırala
  const logs = await TopicLog.find({ username, lesson, topic }).sort({ date: -1 });
  res.json(logs);
});


// 2. ADMIN İSTATİSTİKLERİ & YÖNETİM
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const activeUsersToday = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) } });
    const totalPomodoro = await StudyLog.aggregate([{ $match: { type: 'pomodoro' } }, { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }]);
    
    // Grafikler
    const lessonDistribution = await StudyLog.aggregate([{ $match: { type: 'pomodoro' } }, { $group: { _id: "$lesson", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]);
    const hourlyActivity = await StudyLog.aggregate([{ $match: { timestamp: { $gte: new Date(Date.now() - 24*60*60*1000) } } }, { $group: { _id: { $hour: "$timestamp" }, count: { $sum: 1 } } }, { $sort: { "_id": 1 } }]);
    const recentActivity = await StudyLog.find().sort({ timestamp: -1 }).limit(10).lean();

    res.json({
      totalUsers, totalAdmins, bannedUsers, activeUsersToday,
      totalPomodoroHours: Math.round((totalPomodoro[0]?.totalMinutes || 0) / 60),
      lessonDistribution: lessonDistribution.map(l => ({ name: l._id, value: l.count })),
      hourlyActivity: hourlyActivity.map(h => ({ hour: `${h._id}:00`, count: h.count })),
      recentActivity: recentActivity.map(a => ({ user: a.username, action: `${a.lesson} (${a.duration} dk)`, time: a.timestamp }))
    });
  } catch (e) { res.status(500).json({ error: "Stats hatası" }); }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }).lean();
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    const recentLogs = await StudyLog.find({ timestamp: { $gte: startOfWeek } }).lean();

    const usersWithStats = users.map(user => {
      const userLogs = recentLogs.filter(log => log.username === user.username);
      const dailyMinutes = userLogs.filter(log => new Date(log.timestamp) >= startOfDay).reduce((sum, log) => sum + (log.duration || 0), 0);
      const weeklyMinutes = userLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
      return { ...user, dailyMinutes, weeklyMinutes };
    });
    
    usersWithStats.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
    res.json(usersWithStats);
  } catch (e) { res.status(500).json({ error: "Users hatası" }); }
});

// BANLAMA
app.post('/api/admin/toggle-ban', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if(user.username === 'metosor') return res.status(400).json({error:"Ana Yönetici Banlanamaz!"});
  user.isBanned = !user.isBanned; await user.save();
  res.json({msg:"Ok"});
});

// YETKİ VERME / ALMA
app.post('/api/admin/toggle-role', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (user.username === 'metosor') return res.status(400).json({ error: "Ana Yönetici (Metosor) yetkisi değiştirilemez!" });
  user.role = user.role === 'admin' ? 'student' : 'admin';
  await user.save();
  res.json({ msg: "Rol değiştirildi", newRole: user.role });
});


// 3. ODA SİSTEMİ
app.get('/api/rooms/active', async (req, res) => {
  const activeLimit = new Date(Date.now() - 1 * 60 * 60 * 1000); 
  res.json(await User.find({ "currentRoom.id": { $ne: 'offline' }, lastLogin: { $gte: activeLimit } }, 'username currentRoom title xp'));
});
app.post('/api/rooms/join', async (req, res) => {
  const { username, roomId, topic } = req.body;
  await User.updateOne({ username }, { currentRoom: { id: roomId, topic, enteredAt: new Date() }, lastLogin: new Date() });
  res.json({msg:"Giriş yapıldı"});
});
app.post('/api/rooms/leave', async (req, res) => {
  await User.updateOne({ username: req.body.username }, { "currentRoom.id": "offline", "currentRoom.topic": "" });
  res.json({msg:"Çıkış yapıldı"});
});


// 4. AUTH
app.post('/api/register', async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = (await User.countDocuments({})) === 0 ? 'admin' : 'student';
  await new User({ username, firstName, lastName, email, password: hashedPassword, role }).save();
  res.status(201).json({ msg: "Ok" });
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    if(user.isBanned) return res.status(403).json({error:"Yasaklı Hesap"});
    if(user.username==='metosor') user.role='admin';
    user.lastLogin = new Date(); await user.save();
    res.json({ username: user.username, role: user.role, xp: user.xp, title: user.title });
  } else res.status(401).json({ error: "Hata" });
});


// 5. DİĞER FONKSİYONLAR
app.get('/api/studylogs', async (req, res) => { res.json(await StudyLog.find({ username: req.query.username }).sort({ timestamp: -1 })); });
app.post('/api/studylogs', async (req, res) => {
  const { username, duration, lesson } = req.body;
  await new StudyLog(req.body).save();
  const user = await User.findOne({ username });
  user.xp += Math.floor(duration * 0.5);
  if (user.xp > 10000) user.title = "Efsane"; else if (user.xp > 5000) user.title = "Üstat"; else if (user.xp > 1000) user.title = "Uzman";
  await user.save();
  if (duration >= 25) await new Post({ username: 'SİSTEM', content: `🔥 ${username}, ${lesson} ile alev aldı!`, isSystem: true }).save();
  res.json({ newXP: user.xp, newTitle: user.title });
});
app.get('/api/leaderboard', async (req, res) => {
  const { period, username } = req.query;
  let dateFilter = new Date(0);
  if(period === 'weekly') dateFilter = new Date(Date.now() - 7*24*60*60*1000);
  let matchQuery = { type: 'pomodoro', timestamp: { $gte: dateFilter } };
  if (period === 'friends' && username) {
    const u = await User.findOne({username});
    if(u) matchQuery.username = { $in: [...u.friends, username] };
  }
  const list = await StudyLog.aggregate([{ $match: matchQuery }, { $group: { _id: "$username", totalMinutes: { $sum: "$duration" }, lessons: { $push: "$lesson" } } }, { $sort: { totalMinutes: -1 } }, { $limit: 30 }]);
  res.json(list.map(u => {
    const c = {}; let maxL='-', maxC=0; u.lessons.forEach(l=>{ c[l]=(c[l]||0)+1; if(c[l]>maxC){maxC=c[l]; maxL=l;} });
    return { ...u, favoriteLesson: maxL };
  }));
});

// Standartlar
app.get('/api/exams', async (req, res) => { res.json(await Exam.find({ username: req.query.username })); });
app.post('/api/exams', async (req, res) => { await new Exam(req.body).save(); res.json({msg:"Ok"}); });
app.delete('/api/exams/:id', async (req, res) => { await Exam.findByIdAndDelete(req.params.id); res.json({msg:"Ok"}); });
app.get('/api/program', async (req, res) => { res.json(await Program.find({ username: req.query.username })); });
app.post('/api/program', async (req, res) => { await new Program(req.body).save(); res.json({msg:"Ok"}); });
app.delete('/api/program/:id', async (req, res) => { await Program.findByIdAndDelete(req.params.id); res.json({msg:"Ok"}); });
app.get('/api/questions', async (req, res) => { res.json(await Question.find({ username: req.query.username }).sort({ timestamp: -1 })); });
app.post('/api/questions', async (req, res) => { await new Question(req.body).save(); res.json({msg:"Ok"}); });
app.get('/api/posts', async (req, res) => { res.json(await Post.find().sort({ date: -1 }).limit(20)); });
app.get('/api/friends', async (req, res) => { const user = await User.findOne({username: req.query.username}); res.json(user ? user.friends : []); });
app.post('/api/friends/add', async (req, res) => { const { currentUser, friendEmail } = req.body; const friend = await User.findOne({email: friendEmail}); const me = await User.findOne({username: currentUser}); if(!friend) return res.status(404).json({error:"Bulunamadı"}); if(me.friends.includes(friend.username)) return res.status(400).json({error:"Zaten ekli"}); me.friends.push(friend.username); await me.save(); res.json({msg: "Eklendi"}); });

app.listen(5002, () => console.log("✅ Sunucu 5002 portunda (PRO KONU TAKİBİ) çalışıyor"));