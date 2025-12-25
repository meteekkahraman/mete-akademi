// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { lessonsList } from '../data';

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

  // POMODORO STATE (Global kalması daha sağlıklı)
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);

  // Veri Çekme (XP, Loglar vb.)
  useEffect(() => { fetchLogs(); }, [currentUser]);
  const fetchLogs = async () => { try { const res = await fetch(`https://mete-akademi.onrender.com/api/studylogs?username=${currentUser}`); setStudyLogs(await res.json()); } catch(e) { setStudyLogs([]); } };

  // Güvenli Çıkış
  const handleSafeLogout = async () => {
    try {
      await fetch('https://mete-akademi.onrender.com/api/rooms/leave', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser })
      });
    } catch (e) { console.error("Çıkış hatası:", e); }
    onLogout();
  };

  // Pomodoro Timer Mantığı
  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;
          if (seconds === 0) { if (minutes === 0) { if (hours === 0) { clearInterval(interval); setPomoActive(false); handlePomoFinish(); return prev; } else { hours--; minutes = 59; seconds = 59; } } else { minutes--; seconds = 59; } } else seconds--;
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive]);

  const handlePomoFinish = async () => {
    alert("Tebrikler! Çalışma tamamlandı.");
    const res = await fetch('https://mete-akademi.onrender.com/api/studylogs', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser, lesson: pomoLesson, topic: 'Odaklanma', type: 'pomodoro', duration: 25 }) });
    const data = await res.json(); setXp(data.newXP); setTitle(data.newTitle); fetchLogs();
  };

  // Styles
  const containerStyle = { width: '100%', minHeight:'100vh', background:'#0f172a', color:'white', overflowX: 'hidden' };
  const contentContainerStyle = { width:'100%', maxWidth:'1200px', margin:'0 auto', padding:'20px', boxSizing: 'border-box' };

  return (
    <div style={containerStyle}>
      {/* 1. HEADER BİLEŞENİ */}
      <DashboardHeader 
        currentUser={currentUser} 
        xp={xp} 
        title={title} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        handleSafeLogout={handleSafeLogout} 
        userRole={userRole}
      />

      {/* 2. İÇERİK ALANI */}
      <div style={contentContainerStyle}>
        
        {/* DASHBOARD ANA EKRANI */}
        {activeTab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column' }}>
            {/* A) Net Grafiği ve Ekleme */}
            <NetSection currentUser={currentUser} />
            
            {/* B) Program */}
            <ProgramSection currentUser={currentUser} />
          </div>
        )}

        {/* DİĞER SEKMELER */}
        {activeTab === 'subject' && <SubjectTracker currentUser={currentUser} />}
        {activeTab === 'questions' && <QuestionTracker currentUser={currentUser} />}
        {activeTab === 'pomodoro' && (
          <Pomodoro 
             currentUser={currentUser} 
             pomoActive={pomoActive} setPomoActive={setPomoActive} 
             pomoTime={pomoTime} setPomoTime={setPomoTime} 
             pomoMode={pomoMode} setPomoMode={setPomoMode} 
             pomoLesson={pomoLesson} setPomoLesson={setPomoLesson} 
             allLessons={lessonsList}
          />
        )}
        {activeTab === 'medya' && <Medya currentUser={currentUser}/>}
        {activeTab === 'history' && <History studyLogs={studyLogs}/>}
        {activeTab === 'admin' && <AdminPanel />}

      </div>
    </div>
  );
}