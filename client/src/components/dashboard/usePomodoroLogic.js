// client/src/components/dashboard/usePomodoroLogic.js
import { useState, useEffect, useRef } from 'react';
import { lessonsList } from '../../data';

export const usePomodoroLogic = (currentUser, onSessionComplete) => {
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);
  
  // Süreyi hafızada tutan Ref
  const sessionDurationRef = useRef(25);

  // --- ÖZEL BAŞLATMA FONKSİYONU (INTERCEPTOR) ---
  // Pomodoro bileşeni "Başlat" dediğinde aslında bu çalışacak.
  const handleSetPomoActive = (val) => {
    // Gelen değer fonksiyon mu (prev => !prev) yoksa düz değer mi?
    const newState = typeof val === 'function' ? val(pomoActive) : val;

    // Eğer sayaç BAŞLIYORSA (False -> True geçişi)
    if (newState === true && !pomoActive) {
       // 1. Tüm sayıları garantiye al (String gelirse patlamasın)
       const h = Number(pomoTime.hours) || 0;
       const m = Number(pomoTime.minutes) || 0;
       const s = Number(pomoTime.seconds) || 0;

       // 2. Dakika hesabı (Saniye varsa 1 dk yukarı yuvarla)
       let total = (h * 60) + m + (s > 0 ? 1 : 0);

       console.log("SAYAÇ BAŞLATILDI - Algılanan Süre:", total, "dk");

       // 3. Sadece gerçekten 0 ise 25 yap (Güvenlik)
       // Eğer 1 ise 1 kalır.
       if (total <= 0) total = 25; 
       
       sessionDurationRef.current = total;
    }

    // Son olarak asıl state'i güncelle
    setPomoActive(newState);
  };

  // Geri Sayım Mantığı (Interval)
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;
          if (seconds === 0) {
            if (minutes === 0) {
              if (hours === 0) {
                clearInterval(interval);
                // Burada kendi handleSetPomoActive'imizi değil, 
                // doğrudan state setter'ı çağırabiliriz veya false göndeririz.
                setPomoActive(false); 
                finishSession();
                return prev;
              } else { hours--; minutes = 59; seconds = 59; }
            } else { minutes--; seconds = 59; }
          } else seconds--;
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive]);

  const finishSession = async () => {
    // alert("Tebrikler! Çalışma tamamlandı."); // İstersen açabilirsin
    
    // Hafızadaki kilitli süreyi al
    const realDuration = sessionDurationRef.current;
    console.log("KAYIT EDİLİYOR - Süre:", realDuration);

    try {
      const res = await fetch('http://localhost:5002/api/studylogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser,
          lesson: pomoLesson,
          topic: 'Odaklanma',
          type: 'pomodoro',
          duration: realDuration
        })
      });
      const data = await res.json();
      if (onSessionComplete) onSessionComplete(data);
    } catch (error) {
      console.error("Pomodoro kayıt hatası:", error);
    }
  };

  return {
    pomoActive, 
    setPomoActive: handleSetPomoActive, // <-- SİHİRLİ DOKUNUŞ: Wrapper'ı gönderiyoruz
    pomoMode, setPomoMode,
    pomoTime, setPomoTime,
    pomoLesson, setPomoLesson
  };
};