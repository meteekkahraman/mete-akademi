// client/src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { lessonsList } from '../data';

// --- GÜVENLİ URL ---
const API_URL = 'http://127.0.0.1:5002';

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
  
  // DEBUG STATE (Hata Takibi İçin)
  const [lastSaveStatus, setLastSaveStatus] = useState("Henüz işlem yok");
  const [debugError, setDebugError] = useState(null);

  // --- POMODORO STATE ---
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);

  // 🔥 SÜRE HAFIZASI (REF) 🔥
  const durationRef = useRef(25);

  // --- VERİ ÇEKME ---
  const fetchLogs = async () => { 
    try { 
      const res = await fetch(`${API_URL}/api/studylogs?username=${currentUser}`); 
      if (res.ok) {
        const data = await res.json();
        setStudyLogs(data);
        setDebugError(null); // Hata varsa temizle
      } else {
        setDebugError(`Veri çekilemedi: ${res.status}`);
      }
    } catch(e) { 
      console.error(e);
      setDebugError(`Bağlantı Hatası: ${e.message}`);
      setStudyLogs([]); 
    } 
  };
  
  useEffect(() => { fetchLogs(); }, [currentUser]);

  // --- SÜRE DEĞİŞİMİNİ YAKALA ---
  useEffect(() => {
    if (!pomoActive) {
      const h = Number(pomoTime.hours) || 0;
      const m = Number(pomoTime.minutes) || 0;
      const s = Number(pomoTime.seconds) || 0;
      const totalMinutes = (h * 60) + m + (s > 0 ? 1 : 0);
      
      if (totalMinutes > 0) {
        durationRef.current = totalMinutes;
      }
    }
  }, [pomoTime, pomoActive]);

  // --- GERİ SAYIM ---
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;
          if (hours === 0 && minutes === 0 && seconds === 0) {
            clearInterval(interval);
            setTimeout(() => {
              setPomoActive(false);
              finishSession();
            }, 100);
            return { hours: 0, minutes: 0, seconds: 0 };
          }
          if (seconds === 0) {
            if (minutes === 0) { hours--; minutes = 59; seconds = 59; } 
            else { minutes--; seconds = 59; }
          } else { seconds--; }
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive]);

  // --- KAYIT FONKSİYONU ---
  const finishSession = async () => {
    const realDuration = durationRef.current;
    setLastSaveStatus(`Kaydediliyor... (${realDuration} dk)`);

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
        setLastSaveStatus(`✅ BAŞARILI! ID: ${data.log ? data.log._id : 'Bilinmiyor'}`);
        alert(`Tebrikler! ${realDuration} dakikalık çalışma kaydedildi.`);
        
        setXp(data.newXP); 
        setTitle(data.newTitle); 
        fetchLogs(); // Listeyi yenile
      } else {
        const errText = await res.text();
        setLastSaveStatus(`❌ HATA: Sunucu reddetti (${res.status}) - ${errText}`);
        alert("Kayıt başarısız oldu!");
      }

    } catch (e) {
      setLastSaveStatus(`❌ FETCH HATASI: ${e.message}`);
      alert("Sunucuya ulaşılamadı!");
    }
  };

  const handleSafeLogout = async () => {
    try { await fetch(`${API_URL}/api/rooms/leave`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser }) }); } catch (e) {}
    onLogout();
  };

  const containerStyle = { width: '100%', minHeight:'100vh', background:'#0f172a', color:'white', overflowX: 'hidden', paddingBottom: '100px' };
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

      {/* --- TEKNİK TAKİP PANELİ (DEBUG BAR) --- */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: '100%', 
        background: '#000', color: '#0f0', fontFamily: 'monospace', 
        padding: '10px', fontSize: '12px', borderTop: '2px solid #0f0',
        display: 'flex', justifyContent: 'space-around', zIndex: 9999
      }}>
        <span>👤 KULLANICI: <b>{currentUser || "YOK!"}</b></span>
        <span>🔗 API: <b>{API_URL}</b></span>
        <span>📚 VERİTABANI: <b>{studyLogs.length} Kayıt</b></span>
        <span>💾 SON İŞLEM: <b>{lastSaveStatus}</b></span>
        {debugError && <span style={{color:'red'}}>⚠️ {debugError}</span>}
      </div>

    </div>
  );
}