// client/src/components/dashboard/usePomodoroLogic.js
import { useState, useEffect, useRef } from 'react';
import { lessonsList } from '../../data';

export const usePomodoroLogic = (currentUser, onSessionComplete) => {
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  // Varsayılan 25 dk
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);
  
  // Süreyi hafızada tutacak kutu
  const sessionDurationRef = useRef(25);

  // --- 1. SAYAÇ BAŞLADIĞI AN SÜREYİ KİLİTLE ---
  useEffect(() => {
    if (pomoActive) {
      // Sayaç aktifleştiği an (Play butonuna basınca) burası çalışır.
      // O anki saat, dakika ve saniyeyi alıp toplam dakikaya çeviririz.
      const h = Number(pomoTime.hours) || 0;
      const m = Number(pomoTime.minutes) || 0;
      const s = Number(pomoTime.seconds) || 0;
      
      // Saniye varsa 1 dk yukarı yuvarla (Örn: 0:30 -> 1 dk)
      let totalMinutes = (h * 60) + m + (s > 0 ? 1 : 0);

      // Eğer hesap 0 çıkarsa (örn hata olduysa) en azından 1 dk kabul et
      if (totalMinutes <= 0) totalMinutes = 1;

      console.log(`⏱️ SAYAÇ BAŞLADI: Hedef süre ${totalMinutes} dakika olarak kilitlendi.`);
      sessionDurationRef.current = totalMinutes;
    }
  }, [pomoActive]); // Sadece active değişince (Başlat/Durdur) çalışır

  // --- 2. GERİ SAYIM MANTIĞI ---
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;

          // Süre bitti mi?
          if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(interval);
            // Durum güncellemesi (State update)
            // Önce active'i false yapma işlemini güvenli bir şekilde dışarı alıyoruz
            return prev; 
          }

          if (seconds === 0) {
            if (minutes === 0) {
              hours--; minutes = 59; seconds = 59;
            } else {
              minutes--; seconds = 59;
            }
          } else {
            seconds--;
          }
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive]);

  // --- 3. SÜRE BİTİMİNİ KONTROL ET ---
  // Yukarıdaki interval içinde state değiştirmek bazen sorun yaratır.
  // Bu yüzden sürenin 00:00:00 olduğunu ayrıca dinliyoruz.
  useEffect(() => {
    if (pomoActive && pomoTime.hours === 0 && pomoTime.minutes === 0 && pomoTime.seconds === 0) {
      // Süre gerçekten bitti!
      setPomoActive(false);
      finishSession();
    }
  }, [pomoTime, pomoActive]);

  // --- 4. KAYIT FONKSİYONU ---
  const finishSession = async () => {
    // Hafızadaki kilitli süreyi al
    const realDuration = sessionDurationRef.current;
    
    // Tarayıcı uyarısı
    // alert yerine window.alert kullanarak garantiye alıyoruz
    // setTimeout ile React döngüsünün dışına itiyoruz ki UI donmasın
    setTimeout(() => window.alert(`✅ Süre Doldu! ${realDuration} dakikalık çalışma kaydedildi.`), 100);

    try {
      const res = await fetch('http://localhost:5002/api/studylogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser,
          lesson: pomoLesson,
          topic: 'Odaklanma', // veya seçili konu
          type: 'pomodoro',
          duration: realDuration
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Kayıt Başarılı:", data);
        if (onSessionComplete) onSessionComplete(data);
      } else {
        console.error("Kayıt başarısız oldu.");
      }
      
    } catch (error) {
      console.error("Fetch Hatası:", error);
    }
  };

  return {
    pomoActive, setPomoActive,
    pomoMode, setPomoMode,
    pomoTime, setPomoTime,
    pomoLesson, setPomoLesson
  };
};