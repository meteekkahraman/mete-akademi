// client/src/components/heatmap/HeatmapHeader.jsx
import React from 'react';
import { Map, Filter } from 'lucide-react';
import { lessonsList } from '../../data';

export default function HeatmapHeader({ selectedLesson, setSelectedLesson }) {
  
  const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '20px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' };
  const selectStyle = { backgroundColor: '#1e293b', color: 'white', border: '1px solid #475569', borderRadius: '8px', padding: '10px 15px', outline: 'none', cursor: 'pointer', minWidth: '200px' };

  return (
    <div style={headerStyle}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'white', margin: 0 }}>
        <Map color='#38bdf8' /> Konu Analiz Haritası
      </h2>
      
      <div style={{ position: 'relative' }}>
        <Filter size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
        <select 
          value={selectedLesson} 
          onChange={(e) => setSelectedLesson(e.target.value)}
          style={{ ...selectStyle, paddingLeft: '35px' }}
        >
          {lessonsList.map(lesson => (
            <option key={lesson} value={lesson}>{lesson}</option>
          ))}
        </select>
      </div>
    </div>
  );
}