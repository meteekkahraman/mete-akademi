// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { lessonsList } from '../data';

// Alt Bileşenler
import DashboardHeader from './dashboard/DashboardHeader';
import NetSection from './dashboard/NetSection';
import ProgramSection from './dashboard/ProgramSection';
// Mantık Dosyasını Buradan Çekiyoruz
import { usePomodoroLogic } from './dashboard/usePomodoroLogic';

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

  // Veri Çekme
  const fetchLogs = async () => { 
    try { 
      const res = await fetch(`http://localhost:5002/api/studylogs?username=${currentUser}`); 
      setStudyLogs(await res.json()); 
    } catch(e) { setStudyLogs([]); } 
  };

  useEffect(() => { fetchLogs(); }, [currentUser]);

  // --- POMODORO SONUÇ YÖNETİMİ ---
  // Pomodoro bitince ne olacak? (XP güncelle, listeyi yenile)
  const handlePomoComplete = (data) => {
    setXp(data.newXP);
    setTitle(data.newTitle);
    fetchLogs();
  };

  // --- TÜM SAYAÇ MANTIĞINI TEK SATIRDA ÇAĞIRIYORUZ ---
  const pomoState = usePomodoroLogic(currentUser, handlePomoComplete);

  // Güvenli Çıkış
  const handleSafeLogout = async () => {
    try {
      await fetch('http://localhost:5002/api/rooms/leave', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser })
      });
    } catch (e) { console.error(e); }
    onLogout();
  };

  const containerStyle = { width: '100%', minHeight:'100vh', background:'#0f172a', color:'white', overflowX: 'hidden' };
  const contentContainerStyle = { width:'100%', maxWidth:'1200px', margin:'0 auto', padding:'20px', boxSizing: 'border-box' };

  return (
    <div style={containerStyle}>
      <DashboardHeader 
        currentUser={currentUser} xp={xp} title={title} 
        activeTab={activeTab} setActiveTab={setActiveTab} 
        handleSafeLogout={handleSafeLogout} userRole={userRole}
      />

      <div style={contentContainerStyle}>
        
        {activeTab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column' }}>
            <NetSection currentUser={currentUser} />
            <ProgramSection currentUser={currentUser} />
          </div>
        )}

        {activeTab === 'subject' && <SubjectTracker currentUser={currentUser} />}
        {activeTab === 'questions' && <QuestionTracker currentUser={currentUser} />}
        
        {/* Pomodoro'ya tüm yeteneklerini 'pomoState' paketiyle veriyoruz */}
        {activeTab === 'pomodoro' && (
          <Pomodoro 
             currentUser={currentUser} 
             allLessons={lessonsList}
             {...pomoState} 
          />
        )}
        
        {activeTab === 'medya' && <Medya currentUser={currentUser}/>}
        {activeTab === 'history' && <History studyLogs={studyLogs}/>}
        {activeTab === 'admin' && <AdminPanel />}

      </div>
    </div>
  );
}