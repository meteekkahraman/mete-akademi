// client/src/components/subjects/DetailModal.jsx
import React, { useState } from 'react';
import { X, History, Calendar } from 'lucide-react';

export default function DetailModal({ data, logs, onClose, onAddLog }) {
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logCount, setLogCount] = useState('');

  if (!data) return null;

  const handleSave = () => {
    if (!logCount || !logDate) return alert("Lütfen tarih ve sayı girin.");
    onAddLog(parseInt(logCount), logDate);
    setLogCount('');
  };

  const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', outline: 'none', width:'100%' };

  return (
    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000}}>
      <div style={{backgroundColor:'#1e293b', padding:'25px', borderRadius:'20px', width:'500px', maxWidth:'90%', border:'1px solid #334155', position:'relative', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.5)'}}>
        <button onClick={onClose} style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'#94a3b8', cursor:'pointer'}}><X size={24}/></button>
        
        <h3 style={{color:'white', margin:'0 0 5px 0'}}>{data.topic}</h3>
        <p style={{color:'#38bdf8', fontSize:'13px', marginBottom:'20px', textTransform:'uppercase', fontWeight:'bold'}}>{data.lesson}</p>

        {/* 1. YENİ SORU GİRİŞİ */}
        <div style={{backgroundColor:'#0f172a', padding:'15px', borderRadius:'10px', marginBottom:'20px', border:'1px solid #334155'}}>
          <h4 style={{color:'#94a3b8', fontSize:'12px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'bold'}}>YENİ SORU GİRİŞİ</h4>
          <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <input type="date" value={logDate} onChange={e=>setLogDate(e.target.value)} style={{...inputStyle, flex:1}} />
            <input type="number" placeholder="Soru Sayısı" value={logCount} onChange={e=>setLogCount(e.target.value)} style={{...inputStyle, width:'100px'}} />
            <button onClick={handleSave} style={{padding:'10px 20px', borderRadius:'8px', backgroundColor:'#10b981', color:'white', border:'none', cursor:'pointer', fontWeight:'bold'}}>KAYDET</button>
          </div>
        </div>

        {/* 2. GEÇMİŞ LİSTESİ */}
        <h4 style={{color:'#94a3b8', fontSize:'12px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'bold'}}><History size={14}/> ÇALIŞMA GEÇMİŞİ</h4>
        <div style={{maxHeight:'200px', overflowY:'auto', borderTop:'1px solid #334155'}}>
          {logs.length === 0 ? <p style={{color:'#64748b', fontSize:'13px', fontStyle:'italic', padding:'10px'}}>Henüz kayıt yok.</p> : logs.map((log, i) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 5px', borderBottom:'1px solid #334155', fontSize:'14px', alignItems:'center'}}>
              <span style={{color:'white', display:'flex', alignItems:'center', gap:'8px'}}><Calendar size={14} color='#64748b'/> {new Date(log.date).toLocaleDateString('tr-TR')}</span>
              <span style={{color:'#facc15', fontWeight:'bold', background:'rgba(250, 204, 21, 0.1)', padding:'2px 8px', borderRadius:'6px'}}>{log.count} Soru</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}