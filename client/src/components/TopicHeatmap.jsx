// client/src/components/TopicHeatmap.jsx
import React, { useState, useEffect } from 'react';
import { curriculum, lessonsList } from '../data';

const TopicHeatmap = ({ currentUser }) => { // currentUser prop olarak geliyor
  const [selectedLesson, setSelectedLesson] = useState(lessonsList[0]);
  const [statusData, setStatusData] = useState({}); // Veritabanından gelen veriler
  const [loading, setLoading] = useState(true);

  // Sayfa açılınca veritabanından verileri çek
  useEffect(() => {
    if (!currentUser) return;

    fetch(`http://localhost:5001/api/heatmap?username=${currentUser}`)
      .then(res => res.json())
      .then(data => {
        // Gelen veriyi { "Matematik-Türev": 2 } formatına çeviriyoruz ki kolay kullanalım
        const formattedData = {};
        data.forEach(item => {
          formattedData[`${item.lesson}-${item.topic}`] = item.status;
        });
        setStatusData(formattedData);
        setLoading(false);
      })
      .catch(err => console.error("Veri çekme hatası:", err));
  }, [currentUser]);

  // Renk Kodları
  const getStatusColor = (lesson, topic) => {
    const status = statusData[`${lesson}-${topic}`] || 0;
    switch (status) {
      case 0: return '#ef4444'; // Kırmızı
      case 1: return '#eab308'; // Sarı
      case 2: return '#22c55e'; // Yeşil
      default: return '#ef4444';
    }
  };

  // Tıklayınca durumu değiştir ve veritabanına kaydet
  const toggleStatus = (lesson, topic) => {
    const key = `${lesson}-${topic}`;
    const currentStatus = statusData[key] || 0;
    const nextStatus = (currentStatus + 1) % 3;
    
    // 1. Önce ekranda hemen güncelle (Hız hissi için - Optimistic UI)
    setStatusData(prev => ({ ...prev, [key]: nextStatus }));

    // 2. Sonra arka planda veritabanına gönder
    fetch('http://localhost:5001/api/heatmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: currentUser,
        lesson: lesson,
        topic: topic,
        status: nextStatus
      })
    }).catch(err => console.error("Kaydetme hatası:", err));
  };

  // İstatistik Hesaplama
  const topics = curriculum[selectedLesson] || [];
  const stats = topics.reduce((acc, topic) => {
    const status = statusData[`${selectedLesson}-${topic}`] || 0;
    if (status === 2) acc.green++;
    else if (status === 1) acc.yellow++;
    else acc.red++;
    return acc;
  }, { green: 0, yellow: 0, red: 0 });

  return (
    <div className="p-6 text-white w-full h-full overflow-y-auto">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🗺️ Konu Analiz Haritası
        </h2>
        
        <select 
          value={selectedLesson} 
          onChange={(e) => setSelectedLesson(e.target.value)}
          className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
        >
          {lessonsList.map(lesson => (
            <option key={lesson} value={lesson}>{lesson}</option>
          ))}
        </select>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-600/20 border border-green-500/50 p-4 rounded-xl text-center">
          <div className="text-green-400 text-sm font-bold uppercase">Tamamlandı</div>
          <div className="text-3xl font-bold text-green-500">{stats.green}</div>
        </div>
        <div className="bg-yellow-600/20 border border-yellow-500/50 p-4 rounded-xl text-center">
          <div className="text-yellow-400 text-sm font-bold uppercase">Gelişiyor</div>
          <div className="text-3xl font-bold text-yellow-500">{stats.yellow}</div>
        </div>
        <div className="bg-red-600/20 border border-red-500/50 p-4 rounded-xl text-center">
          <div className="text-red-400 text-sm font-bold uppercase">Riskli / Eksik</div>
          <div className="text-3xl font-bold text-red-500">{stats.red}</div>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 mt-10">Veriler yükleniyor...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {topics.map((topic, index) => (
            <div 
              key={index}
              onClick={() => toggleStatus(selectedLesson, topic)}
              style={{ backgroundColor: getStatusColor(selectedLesson, topic) }}
              className="h-24 rounded-lg p-3 flex items-center justify-center text-center cursor-pointer transform transition hover:scale-105 hover:shadow-xl shadow-md select-none"
            >
              <span className="font-semibold text-sm drop-shadow-md text-white">
                {topic}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopicHeatmap;