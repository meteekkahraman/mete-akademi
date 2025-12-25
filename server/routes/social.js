const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { StudyLog, Post, Exam, Program } = require('../models/CoreModels');

// ODALAR
router.get('/rooms/active', async (req, res) => {
  const activeLimit = new Date(Date.now() - 1 * 60 * 60 * 1000); 
  res.json(await User.find({ "currentRoom.id": { $ne: 'offline' }, lastLogin: { $gte: activeLimit } }, 'username currentRoom title xp'));
});
router.post('/rooms/join', async (req, res) => {
  const { username, roomId, topic } = req.body;
  await User.updateOne({ username }, { currentRoom: { id: roomId, topic, enteredAt: new Date() }, lastLogin: new Date() });
  res.json({msg:"Giriş yapıldı"});
});
router.post('/rooms/leave', async (req, res) => {
  await User.updateOne({ username: req.body.username }, { "currentRoom.id": "offline", "currentRoom.topic": "" });
  res.json({msg:"Çıkış yapıldı"});
});

// LEADERBOARD
router.get('/leaderboard', async (req, res) => {
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

// DİĞERLERİ
router.get('/posts', async (req, res) => { res.json(await Post.find().sort({ date: -1 }).limit(20)); });
router.get('/exams', async (req, res) => { res.json(await Exam.find({ username: req.query.username })); });
router.post('/exams', async (req, res) => { await new Exam(req.body).save(); res.json({msg:"Ok"}); });
router.delete('/exams/:id', async (req, res) => { await Exam.findByIdAndDelete(req.params.id); res.json({msg:"Ok"}); });
router.get('/program', async (req, res) => { res.json(await Program.find({ username: req.query.username })); });
router.post('/program', async (req, res) => { await new Program(req.body).save(); res.json({msg:"Ok"}); });
router.delete('/program/:id', async (req, res) => { await Program.findByIdAndDelete(req.params.id); res.json({msg:"Ok"}); });
router.get('/friends', async (req, res) => { const user = await User.findOne({username: req.query.username}); res.json(user ? user.friends : []); });
router.post('/friends/add', async (req, res) => { const { currentUser, friendEmail } = req.body; const friend = await User.findOne({email: friendEmail}); const me = await User.findOne({username: currentUser}); if(!friend) return res.status(404).json({error:"Bulunamadı"}); if(me.friends.includes(friend.username)) return res.status(400).json({error:"Zaten ekli"}); me.friends.push(friend.username); await me.save(); res.json({msg: "Eklendi"}); });

module.exports = router;