const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Question, Progress, TopicLog, StudyLog, TopicStatus, Post } = require('../models/CoreModels');

// --- 1. SORU TAKİP ---
router.get('/questions', async (req, res) => { 
  res.json(await Question.find({ username: req.query.username }).sort({ timestamp: -1 })); 
});

router.post('/questions', async (req, res) => {
  try {
    const { username, lesson, topic, count, date } = req.body;
    const countVal = Number(count);
    if (!count || isNaN(countVal) || countVal <= 0) return res.status(400).json({ error: "Geçersiz sayı." });
    if (countVal > 120) return res.status(400).json({ error: "Tek seferde max 120 soru." });

    const existingRecords = await Question.find({ username, lesson, topic, date });
    const currentTotal = existingRecords.reduce((acc, curr) => acc + (curr.count || 0), 0);
    if (currentTotal + countVal > 120) return res.status(400).json({ error: "Günlük limit dolu!" });

    await new Question(req.body).save();
    res.json({ msg: "Ok" });
  } catch (error) { res.status(500).json({ error: "Hata" }); }
});

router.delete('/questions/:id', async (req, res) => { 
    await Question.findByIdAndDelete(req.params.id); res.json({msg:"Ok"}); 
});

// --- 2. STUDY LOGS (POMODORO & LİMİTLER) ---
router.get('/studylogs', async (req, res) => { 
    res.json(await StudyLog.find({ username: req.query.username }).sort({ timestamp: -1 })); 
});

router.post('/studylogs', async (req, res) => {
  try {
    const { username, duration, lesson, topic, type } = req.body;
    
    // KURAL 1: Tek seferde max 150 dk
    if (duration > 150) return res.status(400).json({ error: "Tek seferde max 2.5 saat!" });
    if (duration <= 0) return res.status(400).json({ error: "Süre geçersiz." });

    // KURAL 2: Günlük max 14 saat (840 dk)
    const startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
    const todayLogs = await StudyLog.find({ username, timestamp: { $gte: startOfDay } });
    const totalMinutesToday = todayLogs.reduce((acc, log) => acc + log.duration, 0);

    if (totalMinutesToday + duration > 840) return res.status(400).json({ error: "Günlük 14 saat limiti doldu!" });

    // Kayıt
    await new StudyLog({ username, lesson, topic, type, duration }).save();
    
    // XP ve Rütbe
    const user = await User.findOne({ username });
    if(user) {
        user.xp += Math.floor(duration * 1); 
        if (user.xp > 15000) user.title = "Ordinaryüs";
        else if (user.xp > 10000) user.title = "Efsane"; 
        else if (user.xp > 5000) user.title = "Üstat"; 
        else if (user.xp > 1000) user.title = "Uzman";
        await user.save();
    }
    
    // Sistem Mesajı (25dk üstü)
    if (duration >= 25) {
        await new Post({ username: 'SİSTEM', content: `🔥 ${username}, ${lesson} ile alev aldı!`, isSystem: true }).save();
    }

    res.json({ newXP: user ? user.xp : 0, newTitle: user ? user.title : '' });
  } catch (error) { res.status(500).json({ error: "Sunucu hatası" }); }
});

// --- 3. ISI HARİTASI (HEATMAP) ---
router.get('/heatmap', async (req, res) => {
  try { res.json(await TopicStatus.find({ username: req.query.username })); } 
  catch (e) { res.status(500).json({ error: "Veri çekilemedi" }); }
});

router.post('/heatmap', async (req, res) => {
  try {
    const { username, lesson, topic, status } = req.body;
    await TopicStatus.findOneAndUpdate({ username, lesson, topic }, { status }, { upsert: true, new: true });
    res.json({ msg: "Kaydedildi" });
  } catch (e) { res.status(500).json({ error: "Kaydedilemedi" }); }
});

// --- 4. İLERLEME ---
router.get('/progress', async (req, res) => { res.json(await Progress.find({ username: req.query.username })); });
router.post('/progress', async (req, res) => {
    const { username, lesson, topic } = req.body;
    const existing = await Progress.findOne({ username, lesson, topic });
    if (existing) { existing.isCompleted = !existing.isCompleted; await existing.save(); res.json({ status: existing.isCompleted ? 'completed' : 'removed' }); } 
    else { await new Progress({ username, lesson, topic, isCompleted: true }).save(); res.json({ status: 'completed' }); }
});

module.exports = router;