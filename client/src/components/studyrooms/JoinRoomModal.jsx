// client/src/components/studyrooms/JoinRoomModal.jsx
import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';

export default function JoinRoomModal({ room, onClose, onJoin }) {
  const [topic, setTopic] = useState('');

  if (!room) return null;

  const handleJoin = () => {
    if (!topic.trim()) return alert("Lütfen çalışacağın konuyu yaz!");
    onJoin(room.id, topic);
  };

  return (
    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:5000}}>
      <div style={{background:'#1e293b', width:'400px', borderRadius:'20px', border:'1px solid #334155', padding:'25px', position:'relative', boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <button onClick={onClose} style={{position:'absolute', top:20, right:20, background:'none', border:'none', color:'#64748b', cursor:'pointer'}}><X size={20}/></button>
        
        <h3 style={{color:'white', marginBottom:'10px', fontSize:'1.2rem'}}>Odaya Giriş</h3>
        <p style={{color:'#94a3b8', fontSize:'14px', marginBottom:'20px'}}><b>{room.name}</b> odasına girmek üzeresin.</p>

        <div style={{marginBottom:'20px'}}>
          <label style={{color:'#cbd5e1', fontSize:'13px', display:'block', marginBottom:'8px'}}>Şu an ne çalışacaksın?</label>
          <input 
            type="text" 
            placeholder="Örn: Matematik - Türev" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            style={{width:'100%', padding:'12px', borderRadius:'10px', background:'#0f172a', border:'1px solid #334155', color:'white', outline:'none', boxSizing:'border-box'}}
            autoFocus
          />
        </div>

        <button onClick={handleJoin} style={{width:'100%', padding:'12px', borderRadius:'10px', background:'#3b82f6', color:'white', border:'none', fontWeight:'bold', cursor:'pointer', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px'}}>
          <LogIn size={18}/> GİRİŞ YAP
        </button>
      </div>
    </div>
  );
}