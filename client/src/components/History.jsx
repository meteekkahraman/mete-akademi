// client/src/components/History.jsx
import React, { useState, useMemo } from 'react';
import { History as HistoryIcon } from 'lucide-react';

// Alt Bileşenler (Yeni oluşturduğun 'history' klasöründen)
import HistoryStats from './history/HistoryStats';
import HistoryFilters from './history/HistoryFilters';
import HistoryList from './history/HistoryList';

export default function History({ studyLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  // --- İSTATİSTİKLERİ HESAPLA ---
  const stats = useMemo(() => {
    const totalSessions = studyLogs.length;
    const totalMinutes = studyLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    // En çok çalışılan dersi bul
    const lessonCounts = {};
    studyLogs.forEach(log => { lessonCounts[log.lesson] = (lessonCounts[log.lesson] || 0) + 1; });
    const favoriteLesson = Object.keys(lessonCounts).sort((a,b) => lessonCounts[b] - lessonCounts[a])[0] || '-';

    return { totalSessions, totalHours, favoriteLesson };
  }, [studyLogs]);

  // --- FİLTRELEME MANTIĞI ---
  const filteredLogs = studyLogs.filter(log => {
    const matchesSearch = 
      log.lesson.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' ? true : log.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // Stiller
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155', padding: '20px', marginBottom: '20px' };

  return (
    <div style={{ width: '100%', color: 'white' }}>
      
      {/* BAŞLIK */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#10b981', display: 'flex', gap: '10px' }}>
          <HistoryIcon /> Çalışma Analizi
        </h2>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Toplam {stats.totalSessions} Kayıt</span>
      </div>

      {/* 1. İSTATİSTİK KARTLARI */}
      <HistoryStats stats={stats} />

      <div style={cardStyle}>
        {/* 2. FİLTRELER */}
        <HistoryFilters 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          filterType={filterType} 
          setFilterType={setFilterType} 
        />

        {/* 3. LİSTE */}
        <HistoryList filteredLogs={filteredLogs} />
      </div>
    </div>
  );
}