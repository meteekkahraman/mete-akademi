// src/components/dashboard/ProgramSection.jsx
import React, { useState, useEffect } from 'react';
import { Calendar, Download, Clock, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { curriculum, lessonsList } from '../../data';

export default function ProgramSection({ currentUser }) {
  const [programs, setPrograms] = useState([]);
  const [progDay, setProgDay] = useState('Pazartesi');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [progLesson, setProgLesson] = useState(lessonsList[0]);
  const [progTopic, setProgTopic] = useState(curriculum[lessonsList[0]][0]);

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const currentDayName = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });

  useEffect(() => { fetchProgram(); }, [currentUser]);
  const fetchProgram = async () => { const res = await fetch(`https://mete-akademi.onrender.com/api/program?username=${currentUser}`); setPrograms(await res.json()); };

  const addProgram = async () => { 
    if (!startTime || !endTime) return alert("Saat girin!"); 
    await fetch('https://mete-akademi.onrender.com/api/program', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username:currentUser, day:progDay, time:`${startTime} - ${endTime}`, lesson:progLesson, topic:progTopic}) }); 
    fetchProgram(); 
  };
  
  const deleteProgram = async (id) => { 
    if(!confirm('Silinsin mi?')) return; 
    await fetch(`https://mete-akademi.onrender.com/api/program/${id}`, { method: 'DELETE' }); 
    fetchProgram(); 
  };

  // PDF İndirme Fonksiyonu (Burada izole edildi)
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(30, 41, 59); 
    doc.rect(0, 0, 210, 50, 'F'); 
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(24);
    doc.text("METE KAHRAMAN AKADEMI", 14, 32);
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`OGRENCI: ${currentUser.toUpperCase()}`, 195, 28, { align: 'right' });
    doc.text(`TARIH: ${new Date().toLocaleDateString()}`, 195, 36, { align: 'right' });

    let tableBody = [];
    days.forEach(day => {
      const dayItems = programs.filter(p => p.day === day).sort((a, b) => a.time.localeCompare(b.time));
      if (dayItems.length > 0) {
        tableBody.push([{ content: day.toUpperCase(), colSpan: 3, styles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold', halign: 'center' } }]);
        dayItems.forEach(item => { tableBody.push([item.time, item.lesson, item.topic]); });
      }
    });

    autoTable(doc, {
      startY: 60, head: [['SAAT', 'DERS', 'KONU']], body: tableBody, theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold', halign: 'center' },
    });
    doc.save(`kahraman_akademi_program_${currentUser}.pdf`);
  };

  const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155', boxShadow:'0 4px 6px rgba(0,0,0,0.1)', height: '100%', boxSizing: 'border-box' };
  const inputStyle = { padding:'10px', borderRadius:'8px', background:'#0f172a', border:'1px solid #475569', color:'white', width:'100%', boxSizing: 'border-box', marginBottom:'10px' };
  const btnStyle = { width:'100%', padding:'12px', borderRadius:'8px', background:'#3b82f6', border:'none', color:'white', fontWeight:'bold', cursor:'pointer', transition:'0.2s' };

  return (
    <div style={{...cardStyle, marginTop:'30px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
        <h3 style={{color:'#facc15', display:'flex', alignItems:'center', gap:'10px'}}><Calendar size={20}/> Haftalık Program</h3>
        <button onClick={downloadPDF} style={{padding:'8px 15px', borderRadius:'8px', background:'#6366f1', border:'none', color:'white', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center'}}><Download size={16}/> PDF İndir</button>
      </div>
      
      {/* Form Alanı */}
      <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'20px', background:'#0f172a', padding:'15px', borderRadius:'10px', border:'1px solid #334155', alignItems:'flex-end'}}>
         <div style={{flex:'1 1 120px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Gün</label><select style={inputStyle} value={progDay} onChange={e=>setProgDay(e.target.value)}>{days.map(d=><option key={d}>{d}</option>)}</select></div>
         <div style={{flex:'1 1 180px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Saat Aralığı</label><div style={{display:'flex', gap:'5px'}}><input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/><input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/></div></div>
         <div style={{flex:'2 1 200px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Ders</label><select style={inputStyle} value={progLesson} onChange={e=>{setProgLesson(e.target.value); setProgTopic(curriculum[e.target.value][0]);}}>{lessonsList.map(l=><option key={l}>{l}</option>)}</select></div>
         <div style={{flex:'2 1 200px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Konu</label><select style={inputStyle} value={progTopic} onChange={e=>setProgTopic(e.target.value)}>{curriculum[progLesson].map(t=><option key={t}>{t}</option>)}</select></div>
         <div style={{flex:'1 1 100px'}}><button style={{...btnStyle, height:'42px'}} onClick={addProgram}>EKLE</button></div>
      </div>

      {/* Program Grid */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'15px'}}>
        {days.map(day=>(
          <div key={day} style={{background: day===currentDayName?'#1e3a8a':'#0f172a', padding:'15px', borderRadius:'10px', border:'1px solid #334155'}}>
            <h4 style={{color:'#94a3b8', borderBottom:'1px solid #334155', paddingBottom:'5px', marginBottom:'10px', fontWeight:'bold'}}>{day}</h4>
            {programs.filter(p=>p.day===day).sort((a,b)=>a.time.localeCompare(b.time)).map(p=>(
              <div key={p._id} style={{fontSize:'13px', background:'#1e293b', padding:'10px', borderRadius:'8px', marginBottom:'8px', position:'relative', borderLeft:'3px solid #facc15'}}>
                <div style={{color:'#60a5fa', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}><Clock size={12}/> {p.time}</div>
                <div style={{fontWeight:'bold', marginTop:'5px'}}>{p.lesson}</div>
                <div style={{color:'#94a3b8', fontSize:'12px'}}>{p.topic}</div>
                <Trash2 size={14} style={{position:'absolute', top:8, right:8, cursor:'pointer', color:'#ef4444', opacity:0.7, ':hover':{opacity:1}}} onClick={()=>deleteProgram(p._id)}/>
              </div>
            ))}
            {programs.filter(p=>p.day===day).length === 0 && <div style={{fontSize:'12px', color:'#64748b', fontStyle:'italic'}}>Plan yok.</div>}
          </div>
        ))}
      </div>
    </div>
  );
}