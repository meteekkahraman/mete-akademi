// client/src/components/history/HistoryStats.jsx
import React from 'react';
import { Clock, Zap, BookOpen } from 'lucide-react';

export default function HistoryStats({ stats }) {
  const statCardStyle = { flex: 1, backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '15px', minWidth: '200px' };

  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
      <div style={statCardStyle}>
        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.2)' }}><Clock color='#3b82f6' /></div>
        <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Toplam Süre</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalHours} Sa</div></div>
      </div>
      <div style={statCardStyle}>
        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.2)' }}><Zap color='#f97316' /></div>
        <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Oturum</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalSessions}</div></div>
      </div>
      <div style={statCardStyle}>
        <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.2)' }}><BookOpen color='#a855f7' /></div>
        <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Favori Ders</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{stats.favoriteLesson}</div></div>
      </div>
    </div>
  );
}