// src/components/dashboard/NetSection.jsx
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trash2 } from 'lucide-react';
import { lessonsList } from '../../data'; // data.js yolunu kontrol et

export default function NetSection({ currentUser }) {
  const [exams, setExams] = useState([]);
  const [lesson, setLesson] = useState(lessonsList[0]);
  const [net, setNet] = useState('');

  useEffect(() => { fetchExams(); }, [currentUser]);

  const fetchExams = async () => { 
    const res = await fetch(`https://mete-akademi.onrender.com/api/exams?username=${currentUser}`); 
    setExams(await res.json()); 
  };

  const addExam = async () => { 
    await fetch('https://mete-akademi.onrender.com/api/exams', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username:currentUser, lesson, net, date: new Date().toLocaleDateString()}) }); 
    setNet(''); fetchExams(); 
  };

  const deleteExam = async (id) => { 
    if(!confirm('Silinsin mi?')) return; 
    await fetch(`https://mete-akademi.onrender.com/api/exams/${id}`, { method: 'DELETE' }); 
    fetchExams(); 
  };

  const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155', boxShadow:'0 4px 6px rgba(0,0,0,0.1)', height: '100%', boxSizing: 'border-box' };
  const inputStyle = { padding:'10px', borderRadius:'8px', background:'#0f172a', border:'1px solid #475569', color:'white', width:'100%', boxSizing: 'border-box', marginBottom:'10px' };
  const btnStyle = { width:'100%', padding:'12px', borderRadius:'8px', background:'#3b82f6', border:'none', color:'white', fontWeight:'bold', cursor:'pointer', transition:'0.2s' };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px', alignItems: 'start' }}>
      {/* GRAFİK */}
      <div style={{...cardStyle, height: '400px'}}> 
        <h3 style={{marginBottom:'15px', color:'#60a5fa', display:'flex', alignItems:'center', gap:'10px'}}><TrendingUp size={20}/> Net Gelişimi</h3>
        <div style={{width: '100%', height: 'calc(100% - 40px)'}}> 
           <ResponsiveContainer width="100%" height="100%"><LineChart data={exams.map((e,i)=>({n:i+1, net:e.net}))}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="n" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:'8px'}}/><Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer>
        </div>
      </div>

      {/* EKLEME FORMU */}
      <div style={{...cardStyle, height: 'auto'}}> 
        <h3 style={{marginBottom:'15px', color:'#4ade80', display:'flex', alignItems:'center', gap:'10px'}}>➕ Net Ekle</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
          <select style={inputStyle} value={lesson} onChange={e=>setLesson(e.target.value)}>{lessonsList.map(l=><option key={l}>{l}</option>)}</select>
          <input style={inputStyle} type="number" placeholder="Net" value={net} onChange={e=>setNet(e.target.value)}/>
          <button style={{...btnStyle, background:'#10b981'}} onClick={addExam}>KAYDET</button>
          
          <div style={{maxHeight:'200px', overflowY:'auto', fontSize:'13px', marginTop:'10px', borderTop:'1px solid #334155', paddingTop:'10px'}}>
            {exams.slice().reverse().map(e=>(<div key={e._id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #334155', alignItems:'center'}}><span>{e.lesson}</span><span style={{color:'#4ade80', fontWeight:'bold'}}>{e.net} Net <Trash2 size={14} color='#ef4444' style={{cursor:'pointer', marginLeft:'10px'}} onClick={()=>deleteExam(e._id)}/></span></div>))}
          </div>
        </div>
      </div>
    </div>
  );
}