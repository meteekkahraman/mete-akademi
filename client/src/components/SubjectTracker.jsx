import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight, PieChart, PlusCircle, Calendar, History, X } from 'lucide-react';
import { curriculum } from '../data'; 

export default function SubjectTracker({ currentUser }) {
  // ANA STATE'LER
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);
  
  // MODAL (DETAY PENCERESİ) STATE'LERİ
  const [selectedTopicData, setSelectedTopicData] = useState(null); // { lesson: 'Matematik', topic: 'Türev' }
  const [topicLogs, setTopicLogs] = useState([]);
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]); // Bugünün tarihi
  const [logCount, setLogCount] = useState('');

  // 1. İLERLEMEYİ ÇEK
  const fetchProgress = async () => {
    try {
      const res = await fetch(`https://mete-akademi.onrender.com/api/progress?username=${currentUser}`);
      const data = await res.json();
      // Sadece tamamlananları listeye al
      const formatted = data.filter(item => item.isCompleted).map(item => `${item.lesson}-${item.topic}`);
      setCompletedTopics(formatted);
    } catch (e) { console.error("Veri çekme hatası:", e); }
  };

  useEffect(() => { fetchProgress(); }, [currentUser]);

  // 2. TİK ATMA / KALDIRMA
  const toggleTopic = async (lesson, topic) => {
    // Önce sunucuya kaydet
    const res = await fetch('https://mete-akademi.onrender.com/api/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, lesson, topic })
    });
    const data = await res.json();
    
    // Sonra yerel state'i güncelle (Anlık tepki için)
    const key = `${lesson}-${topic}`;
    if (data.status === 'completed') {
      if (!completedTopics.includes(key)) setCompletedTopics([...completedTopics, key]);
    } else {
      setCompletedTopics(completedTopics.filter(t => t !== key));
    }
  };

  // 3. DETAY PENCERESİNİ AÇ VE LOGLARI GETİR
  const openTopicDetail = async (lesson, topic) => {
    setSelectedTopicData({ lesson, topic });
    setLogCount('');
    // Geçmiş verileri çek
    try {
      const res = await fetch(`https://mete-akademi.onrender.com/api/topic/logs?username=${currentUser}&lesson=${lesson}&topic=${topic}`);
      setTopicLogs(await res.json());
    } catch(e) {}
  };

  // 4. YENİ SORU KAYDI EKLE
  const addLog = async () => {
    if (!logCount || !logDate) return alert("Lütfen tarih ve soru sayısı girin.");
    
    await fetch('https://mete-akademi.onrender.com/api/topic/log', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        username: currentUser,
        lesson: selectedTopicData.lesson,
        topic: selectedTopicData.topic,
        count: parseInt(logCount),
        date: logDate
      })
    });
    
    // Logları yenile (Anında listede gözüksün)
    const res = await fetch(`https://mete-akademi.onrender.com/api/topic/logs?username=${currentUser}&lesson=${selectedTopicData.lesson}&topic=${selectedTopicData.topic}`);
    setTopicLogs(await res.json());
    setLogCount('');
  };

  // HESAPLAMALAR
  const calculateProgress = (lesson) => {
    const total = curriculum[lesson].length;
    const completed = curriculum[lesson].filter(topic => completedTopics.includes(`${lesson}-${topic}`)).length;
    return Math.round((completed / total) * 100);
  };

  const toggleAccordion = (lesson) => {
    if (expandedLesson === lesson) setExpandedLesson(null);
    else setExpandedLesson(lesson);
  };

  // STİLLER
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155', marginBottom: '15px', overflow: 'hidden' };
  const headerStyle = { padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' };
  const topicRowStyle = { padding: '12px 20px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', transition: '0.2s' };
  const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: 'white', outline: 'none', width:'100%' };

  return (
    <div style={{ width: '100%', color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#38bdf8', display: 'flex', gap: '10px' }}><PieChart /> Konu Takip Sistemi</h2>
      <p style={{color:'#94a3b8', marginBottom:'20px'}}>Bitirdiğin konuları işaretle, soru çözümlerini "Detay" kısmından kaydet.</p>

      {Object.keys(curriculum).map(lesson => {
        const percent = calculateProgress(lesson);
        const isOpen = expandedLesson === lesson;

        return (
          <div key={lesson} style={cardStyle}>
            {/* DERS BAŞLIĞI */}
            <div style={headerStyle} onClick={() => toggleAccordion(lesson)}>
              <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                {isOpen ? <ChevronDown color='#38bdf8'/> : <ChevronRight color='#94a3b8'/>}
                <span style={{fontWeight:'bold', fontSize:'1.1rem'}}>{lesson}</span>
              </div>
              <div style={{display:'flex', alignItems:'center', gap:'10px', width:'40%'}}>
                 <div style={{width:'100%', height:'8px', backgroundColor:'#334155', borderRadius:'4px', overflow:'hidden'}}>
                    <div style={{width: `${percent}%`, height:'100%', backgroundColor: percent === 100 ? '#22c55e' : '#38bdf8', transition:'width 0.5s'}}></div>
                 </div>
                 <span style={{fontSize:'12px', fontWeight:'bold', color: percent===100?'#22c55e':'#38bdf8', minWidth:'35px'}}>{percent}%</span>
              </div>
            </div>

            {/* KONU LİSTESİ */}
            {isOpen && (
              <div style={{backgroundColor:'#1e293b'}}>
                {curriculum[lesson].map(topic => {
                  const isDone = completedTopics.includes(`${lesson}-${topic}`);
                  return (
                    <div key={topic} style={{...topicRowStyle, backgroundColor: isDone ? 'rgba(56, 189, 248, 0.1)' : 'transparent'}}>
                      
                      {/* SOL: TİK KUTUSU VE İSİM */}
                      <div style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer'}} onClick={() => toggleTopic(lesson, topic)}>
                        {isDone ? <CheckSquare size={24} color='#38bdf8' fill='#38bdf8' fillOpacity={0.2}/> : <Square size={24} color='#64748b'/>}
                        <span style={{color: isDone ? 'white' : '#94a3b8', textDecoration: isDone ? 'line-through' : 'none'}}>{topic}</span>
                      </div>

                      {/* SAĞ: DETAY BUTONU */}
                      <button 
                        onClick={() => openTopicDetail(lesson, topic)}
                        style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 'bold' }}
                      >
                        <PlusCircle size={14}/> DETAY
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* --- DETAY MODALI (POPUP) --- */}
      {selectedTopicData && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:2000}}>
          <div style={{backgroundColor:'#1e293b', padding:'25px', borderRadius:'20px', width:'500px', maxWidth:'90%', border:'1px solid #334155', position:'relative', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.5)'}}>
            <button onClick={()=>setSelectedTopicData(null)} style={{position:'absolute', top:'15px', right:'15px', background:'none', border:'none', color:'#94a3b8', cursor:'pointer'}}><X size={24}/></button>
            
            <h3 style={{color:'white', margin:'0 0 5px 0'}}>{selectedTopicData.topic}</h3>
            <p style={{color:'#38bdf8', fontSize:'13px', marginBottom:'20px', textTransform:'uppercase', fontWeight:'bold'}}>{selectedTopicData.lesson}</p>

            {/* 1. YENİ ÇALIŞMA EKLEME KISMI */}
            <div style={{backgroundColor:'#0f172a', padding:'15px', borderRadius:'10px', marginBottom:'20px', border:'1px solid #334155'}}>
              <h4 style={{color:'#94a3b8', fontSize:'12px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'bold'}}>YENİ SORU GİRİŞİ</h4>
              <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
                <input type="date" value={logDate} onChange={e=>setLogDate(e.target.value)} style={{...inputStyle, flex:1}} />
                <input type="number" placeholder="Soru Sayısı" value={logCount} onChange={e=>setLogCount(e.target.value)} style={{...inputStyle, width:'100px'}} />
                <button onClick={addLog} style={{padding:'10px 20px', borderRadius:'8px', backgroundColor:'#10b981', color:'white', border:'none', cursor:'pointer', fontWeight:'bold'}}>KAYDET</button>
              </div>
            </div>

            {/* 2. GEÇMİŞ LİSTESİ */}
            <h4 style={{color:'#94a3b8', fontSize:'12px', marginBottom:'10px', display:'flex', alignItems:'center', gap:'5px', fontWeight:'bold'}}><History size={14}/> ÇALIŞMA GEÇMİŞİ</h4>
            <div style={{maxHeight:'200px', overflowY:'auto', borderTop:'1px solid #334155'}}>
              {topicLogs.length === 0 ? <p style={{color:'#64748b', fontSize:'13px', fontStyle:'italic', padding:'10px'}}>Henüz kayıt yok.</p> : topicLogs.map((log, i) => (
                <div key={i} style={{display:'flex', justifyContent:'space-between', padding:'12px 5px', borderBottom:'1px solid #334155', fontSize:'14px', alignItems:'center'}}>
                  <span style={{color:'white', display:'flex', alignItems:'center', gap:'8px'}}><Calendar size={14} color='#64748b'/> {new Date(log.date).toLocaleDateString('tr-TR')}</span>
                  <span style={{color:'#facc15', fontWeight:'bold', background:'rgba(250, 204, 21, 0.1)', padding:'2px 8px', borderRadius:'6px'}}>{log.count} Soru</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}