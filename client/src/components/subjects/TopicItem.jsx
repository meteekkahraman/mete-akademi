// client/src/components/subjects/TopicItem.jsx
import React from 'react';
import { CheckSquare, Square, PlusCircle } from 'lucide-react';

export default function TopicItem({ lesson, topic, isCompleted, onToggle, onDetail }) {
  
  const topicRowStyle = { padding: '12px 20px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', transition: '0.2s', backgroundColor: isCompleted ? 'rgba(56, 189, 248, 0.1)' : 'transparent' };

  return (
    <div style={topicRowStyle}>
      {/* SOL: TİK KUTUSU VE İSİM */}
      <div style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}} onClick={() => onToggle(lesson, topic)}>
        {isCompleted ? <CheckSquare size={24} color='#38bdf8' fill='#38bdf8' fillOpacity={0.2}/> : <Square size={24} color='#64748b'/>}
        <span style={{color: isCompleted ? 'white' : '#94a3b8', textDecoration: isCompleted ? 'line-through' : 'none'}}>{topic}</span>
      </div>

      {/* SAĞ: DETAY BUTONU */}
      <button 
        onClick={() => onDetail(lesson, topic)}
        style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 'bold' }}
      >
        <PlusCircle size={14}/> DETAY
      </button>
    </div>
  );
}