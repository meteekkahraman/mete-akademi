// client/src/components/SubjectTracker.jsx
import React, { useState, useEffect } from 'react';
import { PieChart } from 'lucide-react';
import { curriculum } from '../data'; 

// Alt Bileşenler (Yeni oluşturduğun 'subjects' klasöründen)
import SubjectCard from './subjects/SubjectCard';
import DetailModal from './subjects/DetailModal';

export default function SubjectTracker({ currentUser }) {
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);
  
  // Modal State
  const [selectedTopicData, setSelectedTopicData] = useState(null);
  const [topicLogs, setTopicLogs] = useState([]);

  useEffect(() => { fetchProgress(); }, [currentUser]);

  // VERİ ÇEKME
  const fetchProgress = async () => {
    try {
      const res = await fetch(`https://mete-akademi.onrender.com/api/progress?username=${currentUser}`);
      const data = await res.json();
      setCompletedTopics(data.filter(item => item.isCompleted).map(item => `${item.lesson}-${item.topic}`));
    } catch (e) { console.error(e); }
  };

  // TİKLEME MANTIĞI
  const toggleTopic = async (lesson, topic) => {
    const res = await fetch('https://mete-akademi.onrender.com/api/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, lesson, topic })
    });
    const data = await res.json();
    const key = `${lesson}-${topic}`;
    
    if (data.status === 'completed') {
      if (!completedTopics.includes(key)) setCompletedTopics([...completedTopics, key]);
    } else {
      setCompletedTopics(completedTopics.filter(t => t !== key));
    }
  };

  // DETAY AÇMA
  const openTopicDetail = async (lesson, topic) => {
    setSelectedTopicData({ lesson, topic });
    try {
      const res = await fetch(`https://mete-akademi.onrender.com/api/topic/logs?username=${currentUser}&lesson=${lesson}&topic=${topic}`);
      setTopicLogs(await res.json());
    } catch(e) {}
  };

  // YENİ LOG EKLEME
  const handleAddLog = async (count, date) => {
    await fetch('https://mete-akademi.onrender.com/api/topic/log', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: currentUser,
        lesson: selectedTopicData.lesson,
        topic: selectedTopicData.topic,
        count,
        date
      })
    });
    // Güncelle
    const res = await fetch(`https://mete-akademi.onrender.com/api/topic/logs?username=${currentUser}&lesson=${selectedTopicData.lesson}&topic=${selectedTopicData.topic}`);
    setTopicLogs(await res.json());
  };

  return (
    <div style={{ width: '100%', color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#38bdf8', display: 'flex', gap: '10px' }}><PieChart /> Konu Takip Sistemi</h2>
      <p style={{color:'#94a3b8', marginBottom:'20px'}}>Bitirdiğin konuları işaretle, soru çözümlerini "Detay" kısmından kaydet.</p>

      {/* DERS KARTLARI LİSTESİ */}
      {Object.keys(curriculum).map(lesson => (
        <SubjectCard 
          key={lesson}
          lesson={lesson}
          completedTopics={completedTopics}
          expandedLesson={expandedLesson}
          setExpandedLesson={setExpandedLesson}
          onToggle={toggleTopic}
          onDetail={openTopicDetail}
        />
      ))}

      {/* DETAY MODALI */}
      <DetailModal 
        data={selectedTopicData} 
        logs={topicLogs} 
        onClose={() => setSelectedTopicData(null)}
        onAddLog={handleAddLog}
      />
    </div>
  );
}