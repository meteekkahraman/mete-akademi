// client/src/components/dashboard/usePomodoroLogic.js
import { useState, useEffect, useRef } from 'react';
import { lessonsList } from '../../data'; // data.js'ye ulaşmak için iki üst klasöre çıkıyoruz

export const usePomodoroLogic = (currentUser, onSessionComplete) => {
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);
  
  // Süreyi hafızada tutan Ref
  const sessionDurationRef = useRef(25);

  // 1. Sayaç başladığında süreyi kaydet
  useEffect(() => {
    if (pomoActive) {
      const totalMinutes = (pomoTime.hours * 60) + pomoTime.minutes + (pomoTime.seconds > 0 ? 1 : 0);
      sessionDurationRef.current = totalMinutes > 0 ? totalMinutes : 25;
    }
  }, [pomoActive]);

  // 2. Geri Sayım Mantığı
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
                setPomoActive(false);
                finishSession(); // Süre bitti
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

  // 3. Bitince Kaydetme Fonksiyonu
  const finishSession = async () => {
    alert("Tebrikler! Çalışma tamamlandı.");
    const realDuration = sessionDurationRef.current;

    try {
      // Localhost 5002 kullanıyoruz
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
      
      // Dashboard'a haber ver (XP ve Listeyi güncellemesi için)
      if (onSessionComplete) onSessionComplete(data);
      
    } catch (error) {
      console.error("Pomodoro kayıt hatası:", error);
    }
  };

  // Tüm bu verileri Dashboard'a geri gönderiyoruz
  return {
    pomoActive, setPomoActive,
    pomoMode, setPomoMode,
    pomoTime, setPomoTime,
    pomoLesson, setPomoLesson
  };
};