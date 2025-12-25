// client/src/components/Pomodoro.jsx
import React, { useState, useEffect } from 'react';

// --- ALT BİLEŞENLER (Senin yapın korunuyor) ---
import MusicPlayer from './pomodoro/MusicPlayer';
import TimerDisplay from './pomodoro/TimerDisplay';
import StatusBadges from './pomodoro/StatusBadges';
import LessonSelector from './pomodoro/LessonSelector';
import TimerControls from './pomodoro/TimerControls';

export default function Pomodoro({ 
  currentUser, allLessons, 
  pomoActive, setPomoActive, 
  pomoMode, setPomoMode, 
  pomoTime, setPomoTime, 
  pomoLesson, setPomoLesson 
}) {
  // Müzik State (Burası sadece görsel olduğu için burada kalabilir)
  const [selectedMusic, setSelectedMusic] = useState('');
  const [volume, setVolume] = useState(0.5);

  // Limit ve Rozet State'leri
  const [isTop3, setIsTop3] = useState(false);
  const [dailyTotal, setDailyTotal] = useState(0); 
  const DAILY_LIMIT = 840; // 14 Saat
  const MAX_SESSION = 150; // 2.5 Saat

  useEffect(() => {
    const checkStats = async () => {
      if(!currentUser) return;
      try {
        // DÜZELTME: Linkleri Localhost 5002 yaptık
        const resRank = await fetch(`http://localhost:5002/api/leaderboard?period=weekly`);
        const dataRank = await resRank.json();
        const myRank = dataRank.findIndex(u => u._id === currentUser);
        setIsTop3(myRank !== -1 && myRank < 3);

        // Günlük Limit Kontrolü
        const resLogs = await fetch(`http://localhost:5002/api/studylogs?username=${currentUser}`);
        const dataLogs = await resLogs.json();
        const today = new Date();
        today.setHours(0,0,0,0);
        
        const totalToday = dataLogs
          .filter(log => new Date(log.timestamp) >= today)
          .reduce((acc, curr) => acc + (curr.duration || 0), 0);
          
        setDailyTotal(totalToday);
      } catch(e) { console.error("Pomodoro istatistik hatası:", e); }
    };
    checkStats();
  }, [currentUser, pomoActive]); // Sayaç her durup başladığında limiti tekrar kontrol eder

  // --- KONTROL FONKSİYONLARI ---
  const toggleTimer = () => {
    // Önce limit kontrolü
    if (dailyTotal >= DAILY_LIMIT) {
      alert("🛑 DUR YOLCU! Günlük 14 saat çalışma limitini doldurdun.");
      return;
    }
    // Sonra Dashboard'daki hook'u tetikle
    setPomoActive(!pomoActive);
  };
  
  const resetTimer = () => {
    setPomoActive(false);
    // Moduna göre süreyi sıfırla
    setPomoTime({ hours: 0, minutes: pomoMode === 'work' ? 25 : 5, seconds: 0 });
  };

  const handleTimeChange = (e, type) => {
    if (pomoActive) return; // Sayaç çalışırken değiştirmesin

    let val = parseInt(e.target.value);
    if (isNaN(val)) val = 0; // Boş silerse 0 olsun

    const newTime = { ...pomoTime, [type]: val };
    const totalMinutes = (newTime.hours * 60) + newTime.minutes + (newTime.seconds / 60);

    // Max süre kontrolü
    if (totalMinutes > MAX_SESSION) {
      alert("⚠️ Tek seferde max 2.5 saat çalışabilirsin!");
      setPomoTime({ hours: 2, minutes: 30, seconds: 0 });
    } else {
      // BURASI ÇOK ÖNEMLİ:
      // Sen burada setPomoTime yapınca, Dashboard'daki 'pomoTime' güncelleniyor.
      // Dashboard'daki hook da bu yeni süreyi (örn: 1 dk) görüp hafızaya alıyor.
      setPomoTime(newTime);
    }
  };

  const isLimitReached = dailyTotal >= DAILY_LIMIT;
  
  // Stil
  const cardStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column' };

  return (
    <div style={{ display: 'flex', gap: '30px', justifyContent:'center', alignItems:'flex-start', flexWrap:'wrap', animation:'fadeIn 0.5s' }}>
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>

      {/* SOL KART: SAYAÇ VE KONTROLLER */}
      <div style={cardStyle}>
        
        {/* 1. Uyarılar ve Rozetler */}
        <StatusBadges 
          isTop3={isTop3} 
          isLimitReached={isLimitReached} 
        />

        {/* 2. Zaman Göstergesi */}
        {/* handleTimeChange fonksiyonunu TimerDisplay'e gönderiyoruz ki inputlar çalışsın */}
        <TimerDisplay 
          pomoMode={pomoMode} setPomoMode={setPomoMode}
          pomoTime={pomoTime} setPomoTime={setPomoTime}
          setPomoActive={setPomoActive}
          handleTimeChange={handleTimeChange} 
        />

        {/* 3. Ders Seçimi */}
        <LessonSelector 
          pomoMode={pomoMode}
          allLessons={allLessons}
          pomoLesson={pomoLesson}
          setPomoLesson={setPomoLesson}
        />

        {/* 4. Butonlar */}
        <TimerControls 
          toggleTimer={toggleTimer}
          resetTimer={resetTimer}
          pomoActive={pomoActive}
          isLimitReached={isLimitReached}
        />

      </div>

      {/* SAĞ KART: Müzik Çalar */}
      <MusicPlayer 
        selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic}
        volume={volume} setVolume={setVolume}
      />
    </div>
  );
}