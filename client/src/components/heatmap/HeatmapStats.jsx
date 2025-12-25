// client/src/components/heatmap/HeatmapStats.jsx
import React from 'react';

export default function HeatmapStats({ stats }) {
  
  const cardStyle = (borderColor, bgColor, textColor) => ({
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '12px',
    padding: '15px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
      
      {/* YEŞİL KART */}
      <div style={cardStyle('rgba(34, 197, 94, 0.5)', 'rgba(34, 197, 94, 0.1)', '#4ade80')}>
        <div style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Tamamlandı</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#22c55e' }}>{stats.green}</div>
      </div>

      {/* SARI KART */}
      <div style={cardStyle('rgba(234, 179, 8, 0.5)', 'rgba(234, 179, 8, 0.1)', '#facc15')}>
        <div style={{ color: '#facc15', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Gelişiyor</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#eab308' }}>{stats.yellow}</div>
      </div>

      {/* KIRMIZI KART */}
      <div style={cardStyle('rgba(239, 68, 68, 0.5)', 'rgba(239, 68, 68, 0.1)', '#f87171')}>
        <div style={{ color: '#f87171', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>Riskli / Eksik</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#ef4444' }}>{stats.red}</div>
      </div>

    </div>
  );
}