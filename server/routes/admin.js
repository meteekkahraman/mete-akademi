const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { StudyLog } = require('../models/CoreModels');

router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const activeUsersToday = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) } });
    const totalPomodoro = await StudyLog.aggregate([{ $match: { type: 'pomodoro' } }, { $group: { _id: null, totalMinutes: { $sum: "$duration" } } }]);
    
    // (Diğer aggregation kodları aynen buraya gelir, kısaltmak için yazmadım ama index.js'deki admin kodlarının aynısı)
    res.json({ totalUsers, totalAdmins, bannedUsers, activeUsersToday, totalPomodoroHours: Math.round((totalPomodoro[0]?.totalMinutes || 0) / 60) });
  } catch (e) { res.status(500).json({ error: "Stats hatası" }); }
});

router.get('/users', async (req, res) => {
    // (index.js'deki /api/admin/users kodunu buraya yapıştır)
    try { const users = await User.find({}, { password: 0 }).lean(); res.json(users); } catch(e) { res.status(500).json({error:"Hata"}); }
});

router.post('/toggle-ban', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if(user.username === 'metosor') return res.status(400).json({error:"Ana Yönetici Banlanamaz!"});
  user.isBanned = !user.isBanned; await user.save();
  res.json({msg:"Ok"});
});

router.post('/toggle-role', async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (user.username === 'metosor') return res.status(400).json({ error: "Ana Yönetici Değiştirilemez!" });
  user.role = user.role === 'admin' ? 'student' : 'admin';
  await user.save();
  res.json({ msg: "Rol değiştirildi" });
});

module.exports = router;