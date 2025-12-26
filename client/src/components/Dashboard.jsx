// client/src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { lessonsList } from '../data';

// --- SABİT URL (Hata riskini sıfıra indirmek için) ---
const API_URL = 'http://localhost:5002';

// Alt Bileşenler
import DashboardHeader from './dashboard/DashboardHeader';
import NetSection from './dashboard/NetSection';
import ProgramSection from './dashboard/ProgramSection';
import Pomodoro from './Pomodoro';
import History from './History';
import QuestionTracker from './QuestionTracker';
import SubjectTracker from './SubjectTracker';
import AdminPanel from './AdminPanel';
import Medya from './Medya';

export default function Dashboard({ currentUser, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [xp, setXp] = useState(0);
  const [title, setTitle] = useState('Çaylak');
  const [studyLogs, setStudyLogs] = useState([]);

  // --- POMODORO SAYAÇ STATE'LERİ ---
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  // Varsayılan 25 dakika
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);

  // 🔥 SÜREYİ HAFIZADA TUTAN DEĞİŞKEN 🔥
  const durationRef = useRef(25);

  // --- VERİ ÇEKME ---
  const fetchLogs = async () => { 
    console.log("📥 Geçmiş verileri çekiliyor...");
    try { 
      const res = await fetch(`${API_URL}/api/studylogs?username=${currentUser}`); 
      if (res.ok) {
        const data = await res.json();
        setStudyLogs(data);
        console.log(`✅ ${data.length} kayıt çekildi.`);
      } else {
        console.error("❌ Veri çekme hatası. Durum:", res.status);
      }
    } catch(e) { 
      console.error("❌ Sunucu bağlantı hatası:", e);
      setStudyLogs([]); 
    } 
  };
  
  useEffect(() => { fetchLogs(); }, [currentUser]);

  // --- SÜRE DEĞİŞİMİNİ TAKİP ET ---
  // Sen inputa sayı girdikçe burası çalışır ve hafızayı günceller.
  useEffect(() => {
    if (!pomoActive) {
      // String gelebileceği için Number() ile garantiye alıyoruz
      const h = Number(pomoTime.hours) || 0;
      const m = Number(pomoTime.minutes) || 0;
      const s = Number(pomoTime.seconds) || 0;

      const totalMinutes = (h * 60) + m + (s > 0 ? 1 : 0);
      
      if (totalMinutes > 0) {
        durationRef.current = totalMinutes;
        // console.log("Hafızadaki Süre Güncellendi:", durationRef.current); // Çok log olmasın diye kapattım
      }
    }
  }, [pomoTime, pomoActive]);

  // --- GERİ SAYIM MOTORU ---
  useEffect(() => {
    let interval = null;
    
    if (pomoActive) {
      console.log(`▶️ Sayaç Başladı! Hedef Süre: ${durationRef.current} dakika`);
      
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;

          // Hepsi 0 ise BİTİŞ
          if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(interval);
            
            // State güncellemesi çakışmasın diye azıcık gecikmeli bitiriyoruz
            setTimeout(() => {
              setPomoActive(false);
              finishSession();
            }, 100);
            
            return { hours: 0, minutes: 0, seconds: 0 };
          }

          // Geri Sayım Matematiği
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

  // --- KAYIT FONKSİYONU ---
  const finishSession = async () => {
    const realDuration = durationRef.current;
    console.log(`💾 KAYIT BAŞLIYOR... Süre: ${realDuration} dk`);

    try {
      const res = await fetch(`${API_URL}/api/studylogs`, { 
        method: 'POST', 
        headers: {'Content-Type':'application/json'}, 
        body: JSON.stringify({ 
          username: currentUser, 
          lesson: pomoLesson, 
          topic: 'Odaklanma', 
          type: 'pomodoro', 
          duration: realDuration 
        }) 
      });

      if (res.ok) {
        const data = await res.json(); 
        console.log("✅ KAYIT BAŞARILI:", data);
        alert(`Tebrikler! ${realDuration} dakikalık çalışma kaydedildi.`);
        
        // Puan ve Başlık Güncelle
        setXp(data.newXP); 
        setTitle(data.newTitle); 
        
        // Listeyi Yenile
        fetchLogs();
      } else {
        console.error("❌ Kayıt başarısız. Sunucu hatası:", res.status);
        alert("Hata: Kayıt sunucuya iletilemedi!");
      }

    } catch (e) {
      console.error("❌ FETCH HATASI:", e);
      alert("Hata: Sunucuyla bağlantı kurulamadı!");
    }
  };

  const handleSafeLogout = async () => {
    try { await fetch(`${API_URL}/api/rooms/leave`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser }) }); } catch (e) {}
    onLogout();
  };

  const containerStyle = { width: '100%', minHeight:'100vh', background:'#0f172a', color:'white', overflowX: 'hidden' };
  const contentContainerStyle = { width:'100%', maxWidth:'1200px', margin:'0 auto', padding:'20px', boxSizing: 'border-box' };

  return (
    <div style={containerStyle}>
      <DashboardHeader currentUser={currentUser} xp={xp} title={title} activeTab={activeTab} setActiveTab={setActiveTab} handleSafeLogout={handleSafeLogout} userRole={userRole}/>

      <div style={contentContainerStyle}>
        
        {activeTab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column' }}>
            <NetSection currentUser={currentUser} />
            <ProgramSection currentUser={currentUser} />
          </div>
        )}

        {activeTab === 'subject' && <SubjectTracker currentUser={currentUser} />}
        {activeTab === 'questions' && <QuestionTracker currentUser={currentUser} />}
        
        {activeTab === 'pomodoro' && (
          <Pomodoro 
             currentUser={currentUser} 
             allLessons={lessonsList}
             pomoActive={pomoActive} setPomoActive={setPomoActive}
             pomoTime={pomoTime} setPomoTime={setPomoTime}
             pomoMode={pomoMode} setPomoMode={setPomoMode}
             pomoLesson={pomoLesson} setPomoLesson={setPomoLesson}
          />
        )}
        
        {activeTab === 'medya' && <Medya currentUser={currentUser}/>}
        {activeTab === 'history' && <History studyLogs={studyLogs}/>}
        {activeTab === 'admin' && <AdminPanel />}

      </div>
    </div>
  );
}