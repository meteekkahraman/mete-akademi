// client/src/components/TopicHeatmap.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { curriculum, lessonsList } from '../data';

// Alt Bileşenler (heatmap klasöründen)
import HeatmapHeader from './heatmap/HeatmapHeader';
import HeatmapStats from './heatmap/HeatmapStats';
import HeatmapGrid from './heatmap/HeatmapGrid';

export default function TopicHeatmap({ currentUser }) {
  const [selectedLesson, setSelectedLesson] = useState(lessonsList[0]);
  const [statusData, setStatusData] = useState({});
  const [loading, setLoading] = useState(true);

  // Veri Çekme
  useEffect(() => {
    if (!currentUser) return;
    // URL'i diğer dosyalarla uyumlu olsun diye onrender yaptık, istersen localhost yap
    fetch(`https://mete-akademi.onrender.com/api/heatmap?username=${currentUser}`)
      .then(res => res.json())
      .then(data => {
        const formattedData = {};
        data.forEach(item => { formattedData[`${item.lesson}-${item.topic}`] = item.status; });
        setStatusData(formattedData);
        setLoading(false);
      })
      .catch(err => console.error("Veri çekme hatası:", err));
  }, [currentUser]);

  // Renk Belirleme
  const getStatusColor = (lesson, topic) => {
    const status = statusData[`${lesson}-${topic}`] || 0;
    switch (status) {
      case 0: return '#ef4444'; // Kırmızı
      case 1: return '#eab308'; // Sarı
      case 2: return '#22c55e'; // Yeşil
      default: return '#ef4444';
    }
  };

  // Durum Değiştirme (0->1->2->0)
  const toggleStatus = (lesson, topic) => {
    const key = `${lesson}-${topic}`;
    const currentStatus = statusData[key] || 0;
    const nextStatus = (currentStatus + 1) % 3;
    
    // Optimistic UI (Anında güncelle)
    setStatusData(prev => ({ ...prev, [key]: nextStatus }));

    fetch('https://mete-akademi.onrender.com/api/heatmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, lesson, topic, status: nextStatus })
    }).catch(err => console.error("Kaydetme hatası:", err));
  };

  // İstatistik Hesaplama (Memoize edildi)
  const topics = curriculum[selectedLesson] || [];
  
  const stats = useMemo(() => {
    return topics.reduce((acc, topic) => {
      const status = statusData[`${selectedLesson}-${topic}`] || 0;
      if (status === 2) acc.green++;
      else if (status === 1) acc.yellow++;
      else acc.red++;
      return acc;
    }, { green: 0, yellow: 0, red: 0 });
  }, [topics, statusData, selectedLesson]);

  return (
    <div style={{ padding: '20px', width: '100%', height: '100%', overflowY: 'auto', boxSizing: 'border-box' }}>
      
      {/* 1. BAŞLIK VE SEÇİM */}
      <HeatmapHeader 
        selectedLesson={selectedLesson} 
        setSelectedLesson={setSelectedLesson} 
      />

      {/* 2. İSTATİSTİKLER */}
      <HeatmapStats stats={stats} />

      {/* 3. IZGARA (GRID) */}
      <HeatmapGrid 
        topics={topics} 
        selectedLesson={selectedLesson} 
        getStatusColor={getStatusColor} 
        toggleStatus={toggleStatus} 
        loading={loading}
      />
      
    </div>
  );
}