import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trash2, TrendingUp, PlusCircle, LogOut, Calendar, Clock, BookOpen, Layers, CheckCircle, LayoutDashboard, Timer, History as HistoryIcon, Download, Target, PieChart, Shield, Globe, Award, Zap, Menu } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import Pomodoro from './Pomodoro';
import History from './History';
import QuestionTracker from './QuestionTracker';
import SubjectTracker from './SubjectTracker';
import AdminPanel from './AdminPanel';
import Medya from './Medya';
import { curriculum, lessonsList } from '../data';

export default function Dashboard({ currentUser, userRole, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [xp, setXp] = useState(0);
  const [title, setTitle] = useState('Çaylak');

  // DASHBOARD VERİLERİ
  const [lesson, setLesson] = useState(lessonsList[0]);
  const [net, setNet] = useState('');
  const [exams, setExams] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [progDay, setProgDay] = useState('Pazartesi');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [progLesson, setProgLesson] = useState(lessonsList[0]);
  const [progTopic, setProgTopic] = useState(curriculum[lessonsList[0]][0]);
  const [studyLogs, setStudyLogs] = useState([]);

  // POMODORO STATE
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoMode, setPomoMode] = useState('work');
  const [pomoTime, setPomoTime] = useState({ hours: 0, minutes: 25, seconds: 0 });
  const [pomoLesson, setPomoLesson] = useState(lessonsList[0]);

  const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
  const currentDayName = new Date().toLocaleDateString('tr-TR', { weekday: 'long' });

  useEffect(() => { fetchExams(); fetchProgram(); fetchLogs(); }, [currentUser]);
  const fetchExams = async () => { const res = await fetch(`https://mete-akademi.onrender.com/api/exams?username=${currentUser}`); setExams(await res.json()); };
  const fetchProgram = async () => { const res = await fetch(`https://mete-akademi.onrender.com/api/program?username=${currentUser}`); setPrograms(await res.json()); };
  const fetchLogs = async () => { try { const res = await fetch(`https://mete-akademi.onrender.com/api/studylogs?username=${currentUser}`); setStudyLogs(await res.json()); } catch(e) { setStudyLogs([]); } };

  // --- GÜVENLİ ÇIKIŞ FONKSİYONU (YENİ EKLENDİ) ---
  const handleSafeLogout = async () => {
    // 1. Sunucuya "Ben odadan çıkıyorum" de
    try {
      await fetch('https://mete-akademi.onrender.com/api/rooms/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser })
      });
    } catch (e) { 
      console.error("Çıkış hatası:", e); 
    }

    // 2. Uygulamadan çıkış yap
    onLogout();
  };
  // -----------------------------------------------

  useEffect(() => {
    let interval = null;
    if (pomoActive) {
      interval = setInterval(() => {
        setPomoTime(prev => {
          let { hours, minutes, seconds } = prev;
          if (seconds === 0) { if (minutes === 0) { if (hours === 0) { clearInterval(interval); setPomoActive(false); handlePomoFinish(); return prev; } else { hours--; minutes = 59; seconds = 59; } } else { minutes--; seconds = 59; } } else seconds--;
          return { hours, minutes, seconds };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomoActive]);

  const handlePomoFinish = async () => {
    alert("Tebrikler! Çalışma tamamlandı.");
    const res = await fetch('hhttps://mete-akademi.onrender.com/api/studylogs', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser, lesson: pomoLesson, topic: 'Odaklanma', type: 'pomodoro', duration: 25 }) });
    const data = await res.json(); setXp(data.newXP); setTitle(data.newTitle); fetchLogs();
  };

  const addExam = async () => { await fetch('https://mete-akademi.onrender.com/api/exams', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username:currentUser, lesson, net, date: new Date().toLocaleDateString()}) }); setNet(''); fetchExams(); };
  const deleteItem = async (type, id) => { if(!confirm('Silinsin mi?')) return; await fetch(`https://mete-akademi.onrender.com/api/${type}/${id}`, { method: 'DELETE' }); if(type==='exams') fetchExams(); else fetchProgram(); };
  const addProgram = async () => { if (!startTime || !endTime) return alert("Saat girin!"); await fetch('https://mete-akademi.onrender.com/api/program', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({username:currentUser, day:progDay, time:`${startTime} - ${endTime}`, lesson:progLesson, topic:progTopic}) }); fetchProgram(); };
  const downloadPDF = () => { const doc = new jsPDF(); doc.text(`METOSOR AKADEMI - ${currentUser}`, 14, 20); const tableData = programs.map(p => [p.day, p.time, p.lesson, p.topic]); autoTable(doc, { startY: 30, head: [['GÜN', 'SAAT', 'DERS', 'KONU']], body: tableData }); doc.save('program.pdf'); };

  // CSS STYLES (DÜZENLENDİ - TAŞMALAR ENGELLENDİ)
  const containerStyle = { width: '100%', minHeight:'100vh', background:'#0f172a', color:'white', overflowX: 'hidden' }; // Yatay taşmayı gizle
  const headerStyle = { width:'100%', borderBottom:'1px solid #334155', display:'flex', justifyContent:'center', background:'#1e293b', padding:'0 20px', boxSizing: 'border-box' };
  const headerInnerStyle = { width:'100%', maxWidth:'1200px', padding:'15px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap: 'wrap', gap: '15px' };
  const contentContainerStyle = { width:'100%', maxWidth:'1200px', margin:'0 auto', padding:'20px', boxSizing: 'border-box' };
  const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155', boxShadow:'0 4px 6px rgba(0,0,0,0.1)', height: '100%', boxSizing: 'border-box' }; // Yükseklik ve box-sizing eklendi
  const inputStyle = { padding:'10px', borderRadius:'8px', background:'#0f172a', border:'1px solid #475569', color:'white', width:'100%', boxSizing: 'border-box', marginBottom:'10px' };
  const btnStyle = { width:'100%', padding:'12px', borderRadius:'8px', background:'#3b82f6', border:'none', color:'white', fontWeight:'bold', cursor:'pointer', transition:'0.2s' };
  const tabStyle = (active) => ({ padding: '8px 12px', borderRadius: '8px', border: 'none', color: active ? 'white' : '#94a3b8', background: active ? '#3b82f6' : 'transparent', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'14px', transition:'0.2s', whiteSpace: 'nowrap' });

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerInnerStyle}>
          <div>
             <h1 style={{ fontSize:'1.5rem', fontWeight:'bold', margin:0, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>METOSOR AKADEMİ</h1>
             <div style={{ fontSize:'12px', color:'#94a3b8', display:'flex', gap:'10px', marginTop:'2px' }}><span><Award size={12}/> {title}</span> <span><Zap size={12}/> {xp} XP</span></div>
          </div>
          
          {/* MOBİL UYUMLU MENÜ (Sığmazsa kaydırılabilir) */}
          <div style={{ display:'flex', gap:'5px', overflowX: 'auto', paddingBottom:'5px', maxWidth: '100%', scrollbarWidth: 'none' }}>
            <button onClick={()=>setActiveTab('dashboard')} style={tabStyle(activeTab==='dashboard')}><LayoutDashboard size={18}/> Panel</button>
            <button onClick={()=>setActiveTab('subject')} style={tabStyle(activeTab==='subject')}><PieChart size={18}/> Konular</button>
            <button onClick={()=>setActiveTab('questions')} style={tabStyle(activeTab==='questions')}><Target size={18}/> Sorular</button>
            <button onClick={()=>setActiveTab('pomodoro')} style={tabStyle(activeTab==='pomodoro')}><Timer size={18}/> Pomodoro</button>
            <button onClick={()=>setActiveTab('medya')} style={tabStyle(activeTab==='medya')}><Globe size={18}/> Medya</button>
            <button onClick={()=>setActiveTab('history')} style={tabStyle(activeTab==='history')}><HistoryIcon size={18}/> Geçmiş</button>
            {userRole === 'admin' && <button onClick={()=>setActiveTab('admin')} style={tabStyle(activeTab==='admin')}><Shield size={18}/> Yönetim</button>}
            
            {/* ÇIKIŞ BUTONU GÜNCELLENDİ: Artık handleSafeLogout çağırıyor */}
            <button onClick={handleSafeLogout} style={{...tabStyle(false), background:'#ef4444', color:'white', marginLeft:'auto'}}><LogOut size={18}/></button>
          </div>
        </div>
      </div>

      <div style={contentContainerStyle}>
        {activeTab === 'dashboard' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'30px' }}>
            {/* ÜST KISIM: GRAFİK VE NET EKLEME (Responsive Grid) */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px', alignItems: 'start' }}>
              <div style={{...cardStyle, height: '400px'}}> {/* Sabit yükseklik verildi */}
                <h3 style={{marginBottom:'15px', color:'#60a5fa', display:'flex', alignItems:'center', gap:'10px'}}><TrendingUp size={20}/> Net Gelişimi</h3>
                <div style={{width: '100%', height: 'calc(100% - 40px)'}}> {/* Kalan yüksekliği kapla */}
                   <ResponsiveContainer width="100%" height="100%"><LineChart data={exams.map((e,i)=>({n:i+1, net:e.net}))}><CartesianGrid stroke="#334155" strokeDasharray="3 3"/><XAxis dataKey="n" stroke="#94a3b8"/><YAxis stroke="#94a3b8"/><Tooltip contentStyle={{background:'#1e293b', border:'1px solid #334155', borderRadius:'8px'}}/><Line type="monotone" dataKey="net" stroke="#3b82f6" strokeWidth={3} dot={{r:4}}/></LineChart></ResponsiveContainer>
                </div>
              </div>
              <div style={{...cardStyle, height: 'auto'}}> {/* Yükseklik içeriğe göre */}
                <h3 style={{marginBottom:'15px', color:'#4ade80', display:'flex', alignItems:'center', gap:'10px'}}>➕ Net Ekle</h3>
                <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <select style={inputStyle} value={lesson} onChange={e=>setLesson(e.target.value)}>{lessonsList.map(l=><option key={l}>{l}</option>)}</select>
                  <input style={inputStyle} type="number" placeholder="Net" value={net} onChange={e=>setNet(e.target.value)}/>
                  <button style={{...btnStyle, background:'#10b981', ':hover':{background:'#059669'}}} onClick={addExam}>KAYDET</button>
                  <div style={{maxHeight:'200px', overflowY:'auto', fontSize:'13px', marginTop:'10px', borderTop:'1px solid #334155', paddingTop:'10px'}}>
                    {exams.slice().reverse().map(e=>(<div key={e._id} style={{display:'flex', justifyContent:'space-between', padding:'8px', borderBottom:'1px solid #334155', alignItems:'center'}}><span>{e.lesson}</span><span style={{color:'#4ade80', fontWeight:'bold'}}>{e.net} Net <Trash2 size={14} color='#ef4444' style={{cursor:'pointer', marginLeft:'10px'}} onClick={()=>deleteItem('exams',e._id)}/></span></div>))}
                  </div>
                </div>
              </div>
            </div>

            {/* HAFTALIK PROGRAM */}
            <div style={cardStyle}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
                <h3 style={{color:'#facc15', display:'flex', alignItems:'center', gap:'10px'}}><Calendar size={20}/> Haftalık Program</h3>
                <button onClick={downloadPDF} style={{padding:'8px 15px', borderRadius:'8px', background:'#6366f1', border:'none', color:'white', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center'}}><Download size={16}/> PDF İndir</button>
              </div>
              
              {/* Program Ekleme Formu (Responsive) */}
              <div style={{display:'flex', gap:'10px', flexWrap:'wrap', marginBottom:'20px', background:'#0f172a', padding:'15px', borderRadius:'10px', border:'1px solid #334155', alignItems:'flex-end'}}>
                 <div style={{flex:'1 1 120px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Gün</label><select style={inputStyle} value={progDay} onChange={e=>setProgDay(e.target.value)}>{days.map(d=><option key={d}>{d}</option>)}</select></div>
                 <div style={{flex:'1 1 180px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Saat Aralığı</label><div style={{display:'flex', gap:'5px'}}><input type="time" style={inputStyle} value={startTime} onChange={e=>setStartTime(e.target.value)}/><input type="time" style={inputStyle} value={endTime} onChange={e=>setEndTime(e.target.value)}/></div></div>
                 <div style={{flex:'2 1 200px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Ders</label><select style={inputStyle} value={progLesson} onChange={e=>{setProgLesson(e.target.value); setProgTopic(curriculum[e.target.value][0]);}}>{lessonsList.map(l=><option key={l}>{l}</option>)}</select></div>
                 <div style={{flex:'2 1 200px'}}><label style={{fontSize:'12px', color:'#94a3b8', display:'block', marginBottom:'5px'}}>Konu</label><select style={inputStyle} value={progTopic} onChange={e=>setProgTopic(e.target.value)}>{curriculum[progLesson].map(t=><option key={t}>{t}</option>)}</select></div>
                 <div style={{flex:'1 1 100px'}}><button style={{...btnStyle, height:'42px'}} onClick={addProgram}>EKLE</button></div>
              </div>

              {/* Program Kartları (Grid) */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap:'15px'}}>
                {days.map(day=>(
                  <div key={day} style={{background: day===currentDayName?'#1e3a8a':'#0f172a', padding:'15px', borderRadius:'10px', border:'1px solid #334155'}}>
                    <h4 style={{color:'#94a3b8', borderBottom:'1px solid #334155', paddingBottom:'5px', marginBottom:'10px', fontWeight:'bold'}}>{day}</h4>
                    {programs.filter(p=>p.day===day).sort((a,b)=>a.time.localeCompare(b.time)).map(p=>(
                      <div key={p._id} style={{fontSize:'13px', background:'#1e293b', padding:'10px', borderRadius:'8px', marginBottom:'8px', position:'relative', borderLeft:'3px solid #facc15'}}>
                        <div style={{color:'#60a5fa', fontWeight:'bold', display:'flex', alignItems:'center', gap:'5px'}}><Clock size={12}/> {p.time}</div>
                        <div style={{fontWeight:'bold', marginTop:'5px'}}>{p.lesson}</div>
                        <div style={{color:'#94a3b8', fontSize:'12px'}}>{p.topic}</div>
                        <Trash2 size={14} style={{position:'absolute', top:8, right:8, cursor:'pointer', color:'#ef4444', opacity:0.7, ':hover':{opacity:1}}} onClick={()=>deleteItem('program',p._id)}/>
                      </div>
                    ))}
                    {programs.filter(p=>p.day===day).length === 0 && <div style={{fontSize:'12px', color:'#64748b', fontStyle:'italic'}}>Plan yok.</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DİĞER SEKME İÇERİKLERİ (Aynı kalıyor) */}
        {activeTab === 'subject' && <SubjectTracker currentUser={currentUser} />}
        {activeTab === 'questions' && <QuestionTracker currentUser={currentUser} />}
        {activeTab === 'pomodoro' && <Pomodoro currentUser={currentUser} pomoActive={pomoActive} setPomoActive={setPomoActive} pomoTime={pomoTime} setPomoTime={setPomoTime} pomoMode={pomoMode} setPomoMode={setPomoMode} pomoLesson={pomoLesson} setPomoLesson={setPomoLesson} allLessons={lessonsList}/>}
        {activeTab === 'medya' && <Medya currentUser={currentUser}/>}
        {activeTab === 'history' && <History studyLogs={studyLogs}/>}
        {activeTab === 'admin' && <AdminPanel />}
      </div>
    </div>
  );
}