import React from 'react';

export default function LessonSelector({ pomoMode, allLessons, pomoLesson, setPomoLesson }) {
  // Sadece Odak modunda görünür
  if (pomoMode !== 'work') return null;

  const selectStyle = { padding: '10px 15px', borderRadius: '10px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #475569', width: '250px', outline: 'none', textAlign:'center', fontSize:'1rem' };

  return (
    <div style={{marginTop:'25px', display:'flex', flexDirection:'column', gap:'10px', alignItems:'center'}}>
      <select value={pomoLesson} onChange={(e)=>setPomoLesson(e.target.value)} style={selectStyle}>
        {allLessons.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
}