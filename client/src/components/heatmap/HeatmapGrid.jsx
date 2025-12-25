// client/src/components/heatmap/HeatmapGrid.jsx
import React from 'react';

export default function HeatmapGrid({ topics, selectedLesson, getStatusColor, toggleStatus, loading }) {
  
  if (loading) {
    return <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '40px' }}>Veriler yükleniyor...</div>;
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
      {topics.map((topic, index) => (
        <div 
          key={index}
          onClick={() => toggleStatus(selectedLesson, topic)}
          style={{ 
            backgroundColor: getStatusColor(selectedLesson, topic),
            height: '100px',
            borderRadius: '12px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s',
            boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
            userSelect: 'none',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {topic}
        </div>
      ))}
    </div>
  );
}