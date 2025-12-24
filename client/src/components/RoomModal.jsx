import React, { useState, useEffect } from 'react';
import { X, Layers, LogIn, BookOpen } from 'lucide-react';
// Ders ve Konu listesini çekiyoruz
import { curriculum, lessonsList } from '../data'; 

export default function RoomModal({ room, onClose, onJoin }) {
  // Varsayılan olarak ilk dersi ve onun ilk konusunu seçelim
  const [selectedLesson, setSelectedLesson] = useState(lessonsList[0]);
  const [selectedTopic, setSelectedTopic] = useState(curriculum[lessonsList[0]][0]);

  // Ders değişince, konu listesini o dersin konularıyla güncelle ve ilkini seç
  useEffect(() => {
    setSelectedTopic(curriculum[selectedLesson][0]);
  }, [selectedLesson]);

  const handleSubmit = () => {
    if (!selectedLesson || !selectedTopic) return alert("Lütfen ders ve konu seç.");
    // Seçilen ders ve konuyu birleştirip gönderiyoruz (Örn: "Matematik - Türev")
    onJoin(room.id, `${selectedLesson} - ${selectedTopic}`);
  };

  return (
    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000}}>
      <div style={{backgroundColor:'#1e293b', padding:'30px', borderRadius:'20px', width:'400px', border:'1px solid #334155', position:'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
        <button onClick={onClose} style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'#94a3b8', cursor:'pointer'}}><X size={20}/></button>
        
        <h2 style={{color:'white', marginBottom:'20px', display:'flex', alignItems:'center', gap:'10px'}}>🚪 {room.name}</h2>
        <p style={{color:'#94a3b8', marginBottom:'25px', fontSize:'14px'}}>Bu odaya giriş yapmak üzeresin. Ne çalışacağını seç.</p>

        {/* DERS SEÇİMİ */}
        <div style={{marginBottom:'20px'}}>
          <label style={{color:'#cbd5e1', display:'block', marginBottom:'8px', fontSize:'13px', fontWeight:'bold'}}>Ders Seç</label>
          <div style={{position:'relative'}}>
            <BookOpen size={18} style={{position:'absolute', top:'12px', left:'12px', color:'#3b82f6'}}/>
            <select value={selectedLesson} onChange={e=>setSelectedLesson(e.target.value)} style={inputStyle}>
              {lessonsList.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* KONU SEÇİMİ */}
        <div style={{marginBottom:'30px'}}>
          <label style={{color:'#cbd5e1', display:'block', marginBottom:'8px', fontSize:'13px', fontWeight:'bold'}}>Konu Seç</label>
          <div style={{position:'relative'}}>
            <Layers size={18} style={{position:'absolute', top:'12px', left:'12px', color:'#10b981'}}/>
            <select value={selectedTopic} onChange={e=>setSelectedTopic(e.target.value)} style={inputStyle}>
              {curriculum[selectedLesson].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <button onClick={handleSubmit} style={{width:'100%', padding:'12px', borderRadius:'10px', backgroundColor:'#10b981', color:'white', border:'none', fontWeight:'bold', cursor:'pointer', display:'flex', justifyContent:'center', gap:'10px', alignItems:'center', transition:'0.3s', ':hover':{backgroundColor:'#059669'}}}>
          <LogIn size={18}/> ODAYA KATIL
        </button>
      </div>
    </div>
  );
}

const inputStyle = { width:'100%', padding:'12px 12px 12px 40px', borderRadius:'10px', border:'1px solid #475569', backgroundColor:'#0f172a', color:'white', outline:'none', fontSize:'14px', appearance:'none', backgroundImage: `url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2394a3b8%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px top 50%', backgroundSize: '12px auto' };