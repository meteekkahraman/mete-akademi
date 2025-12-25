// client/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { lessonsList } from '../data';
import { usePomodoroLogic } from './dashboard/usePomodoroLogic'; // Yeni dosya yolu

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

  // --- VERİ ÇEKME (GEÇMİŞİN GERİ GELMESİ İÇİN) ---
  const fetchLogs = async () => { 
    try { 
      // BURAYA DİKKAT: Port 5002 olmalı
      const res = await fetch(`http://localhost:5002/api/studylogs?username=${currentUser}`); 
      
      if (res.ok) {
        const data = await res.json();
        setStudyLogs(data); // Veriyi state'e at
      } else {
        console.error("Veri çekilemedi, durum kodu:", res.status);
      }
    } catch(e) { 
      console.error("Dashboard Veri Hatası:", e);
      // Hata olsa bile boş array atayalım ki harita patlamasın
      setStudyLogs([]); 
    } 
  };

  // Sayfa açılınca verileri çek
  useEffect(() => { fetchLogs(); }, [currentUser]);

  // Pomodoro bitince listeyi güncelle
  const handlePomoComplete = (data) => {
    setXp(data.newXP);
    setTitle(data.newTitle);
    fetchLogs(); // <-- İşte bu fonksiyon geçmiş listesini yeniler
  };

  // Mantık Hook'u
  const pomoState = usePomodoroLogic(currentUser, handlePomoComplete);

  const handleSafeLogout = async () => {
    try {
      await fetch('http://localhost:5002/api/rooms/leave', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser })
      });
    } catch (e) {}
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
        
        {/* Pomodoro'ya state'i aktar */}
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