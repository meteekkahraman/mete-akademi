const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// KAYIT OL
router.post('/register', async (req, res) => {
  try {
    const { username, firstName, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const role = (await User.countDocuments({})) === 0 ? 'admin' : 'student';
    await new User({ username, firstName, lastName, email, password: hashedPassword, role }).save();
    res.status(201).json({ msg: "Ok" });
  } catch (e) { res.status(500).json({ error: "Kayıt hatası" }); }
});

// GİRİŞ YAP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      if(user.isBanned) return res.status(403).json({error:"Yasaklı Hesap"});
      if(user.username==='metosor') user.role='admin';
      user.lastLogin = new Date(); await user.save();
      res.json({ username: user.username, role: user.role, xp: user.xp, title: user.title });
    } else res.status(401).json({ error: "Hatalı bilgi" });
  } catch (e) { res.status(500).json({ error: "Giriş hatası" }); }
});

module.exports = router;