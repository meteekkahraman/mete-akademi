const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const connectDB = require('./config/db');
require('dotenv').config();

// Uygulama Başlat
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

// Veritabanı Bağlantısı
connectDB();

// ROTALAR (Routes)
app.use('/api', require('./routes/auth'));   // Giriş, Kayıt
app.use('/api', require('./routes/study'));  // Soru, Pomodoro, Heatmap
app.use('/api', require('./routes/social')); // Odalar, Liderlik, Arkadaşlar
app.use('/api/admin', require('./routes/admin')); // Admin

// Sunucuyu Dinle
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ Sunucu ${PORT} portunda çalışıyor`));