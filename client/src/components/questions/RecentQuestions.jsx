// client/src/components/questions/RecentQuestions.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';

export default function RecentQuestions({ questions, onDelete }) {
  if (!questions || questions.length === 0) return null;

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155' }}>
      <h4 style={{ fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>Son Eklenenler</h4>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
        {questions.slice().reverse().slice(0, 5).map(q => (
          <div key={q._id} style={{ padding: '10px', borderBottom: '1px solid #334155', background:'#0f172a', marginBottom:'5px', borderRadius:'6px' }}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'bold', color:'white'}}><span>{q.lesson}</span><span style={{color:'#a78bfa'}}>{q.count} Soru</span></div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'3px'}}><span style={{fontSize:'11px', color:'#94a3b8', fontStyle:'italic'}}>{q.topic}</span><Trash2 size={12} style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => onDelete(q._id)} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}