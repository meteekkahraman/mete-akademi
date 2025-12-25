// client/src/components/Dashboard.jsx
import React, { useState, useEffect, useRef } from 'react'; // useRef EKLENDİ
import { lessonsList } from '../data';
import API_BASE_URL from '../apiConfig'; // Varsa kullan yoksa 'http://localhost:5002' yaz

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

  // --- POMODORO DEVRELERİ ---
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);

  // 🔥 KRİTİK EKLENTİ: SÜREYİ HAFIZAYA ALAN REF 🔥
  const sessionDurationRef = useRef(25);

  // Veri Çekme
  const fetchLogs = async () => { 
    try { 
      // Linki kendine göre düzenle (localhost:5002)
      const res = await fetch(`http://localhost:5002/api/studylogs?username=${currentUser}`); 
      setStudyLogs(await res.json()); 
    } catch(e) { setStudyLogs([]); } 
  };
  useEffect(() => { fetchLogs(); }, [currentUser]);

  // --- EKLENTİ: SAYAÇ BAŞLAYINCA SÜREYİ KİLİTLE ---
  useEffect(() => {
    if (pomoActive) {
      // Sayaç başladığı anki dakikayı hesapla
      const total = (pomoTime.hours * 60) + pomoTime.minutes + (pomoTime.seconds > 0 ? 1 : 0);
      // Hafızaya yaz (Eğer 0 ise en az 1 olsun)
      sessionDurationRef.current = total > 0 ? total : 25;
      console.log("Kilitlenen Süre:", sessionDurationRef.current);
    }
  }, [pomoActive]);

  // Pomodoro Timer Mantığı
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
                handlePomoFinish(); // BİTTİ
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

  const handlePomoFinish = async () => {
    alert("Tebrikler! Çalışma tamamlandı.");
    
    // 🔥 DÜZELTME: SABİT 25 YERİNE HAFIZADAKİ SÜREYİ AL 🔥
    const realDuration = sessionDurationRef.current;

    const res = await fetch('http://localhost:5002/api/studylogs', { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({ 
        username: currentUser, 
        lesson: pomoLesson, 
        topic: 'Odaklanma', 
        type: 'pomodoro', 
        duration: realDuration // <-- ARTIK DOĞRU SÜRE GİDİYOR
      }) 
    });
    const data = await res.json(); 
    setXp(data.newXP); 
    setTitle(data.newTitle); 
    fetchLogs();
  };

  const handleSafeLogout = async () => {
    try { await fetch('http://localhost:5002/api/rooms/leave', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser }) }); } catch (e) {}
    onLogout();
  };

  // Styles
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