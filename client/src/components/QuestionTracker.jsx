import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PlusCircle, Target, Trash2, Filter, Layers, AlertCircle } from 'lucide-react'; // AlertCircle eklendi
import { curriculum, lessonsList } from '../data'; 

export default function QuestionTracker({ currentUser }) {
  const [qLesson, setQLesson] = useState(lessonsList[0]);
  const [qTopic, setQTopic] = useState(curriculum[lessonsList[0]][0]); 
  const [qCount, setQCount] = useState('');
  const [filterLesson, setFilterLesson] = useState('TÜM DERSLER');
  const [questions, setQuestions] = useState([]);

  // Ders değişince konuları da güncelle
  const handleLessonChange = (e) => {
    const selectedLesson = e.target.value;
    setQLesson(selectedLesson);
    setQTopic(curriculum[selectedLesson][0]); 
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`http://localhost:5001/api/questions?username=${currentUser}`);
      if (res.ok) {
        setQuestions(await res.json());
      }
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
  };

  useEffect(() => { fetchQuestions(); }, [currentUser]);

  // --- GELİŞTİRİLMİŞ SORU EKLEME FONKSİYONU ---
  const addQuestion = async () => {
    const countVal = parseInt(qCount);

    // 1. BOŞ GİRİŞ KONTROLÜ
    if (!qCount || isNaN(countVal) || countVal <= 0) {
      return alert("Lütfen geçerli bir soru sayısı girin!");
    }

    // 2. TEK SEFERDE MAKSİMUM GİRİŞ LİMİTİ (Kesin Engel)
    if (countVal > 120) {
      return alert("❌ HATA: Tek seferde en fazla 120 soru girişi yapabilirsiniz!\n(Gerçekçi olalım, tek oturuşta 500 soru çözmedin 😉)");
    }

    // 3. GÜNLÜK TOPLAM LİMİT KONTROLÜ (Bugün + Bu Konu)
    // Bugünün tarihini al (Format: 'DD.MM.YYYY' - Backendi'n formatına uyumlu olmalı)
    const todayStr = new Date().toLocaleDateString(); 

    // Sadece BUGÜN, SEÇİLİ DERS ve SEÇİLİ KONU için girilmiş soruları bul
    const todayEntries = questions.filter(q => 
      q.lesson === qLesson && 
      q.topic === qTopic && 
      q.date === todayStr // Backendden gelen tarih formatıyla eşleşmeli
    );

    // Bugün bu konu için toplam kaç soru girilmiş?
    const currentDailyTotal = todayEntries.reduce((acc, curr) => acc + curr.count, 0);

    // Eğer (Mevcut Günlük Toplam + Yeni Girilen) > 120 ise DURDUR.
    if (currentDailyTotal + countVal > 120) {
      const remainingLimit = 120 - currentDailyTotal;
      return alert(`⚠️ GÜNLÜK LİMİT AŞIMI\n\nBu konu (${qTopic}) için bugün zaten ${currentDailyTotal} soru girdin.\nGünlük limit 120 sorudur.\n\nKalan hakkın: ${remainingLimit > 0 ? remainingLimit : 0}`);
    }

    // KONTROLLER GEÇİLDİ, KAYDET
    try {
      const res = await fetch('http://localhost:5001/api/questions', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, lesson: qLesson, topic: qTopic, count: countVal })
      });
      
      if (res.ok) {
        setQCount(''); 
        fetchQuestions(); // Listeyi güncelle
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };
  // -------------------------------------------

  const deleteQuestion = async (id) => {
    if (!confirm("Bu kaydı silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5001/api/questions/${id}`, { method: 'DELETE' });
    fetchQuestions();
  };

  // --- ANALİZ KISMI ---
  const filteredQuestions = questions.filter(q => filterLesson === 'TÜM DERSLER' ? true : q.lesson === filterLesson);
  
  // Aylık toplam hesaplama
  const currentMonth = new Date().getMonth();
  const monthlyQuestions = filteredQuestions.filter(q => {
    // Tarih formatı hatasını önlemek için güvenli kontrol
    if(!q.timestamp && !q.date) return false;
    const dateObj = q.timestamp ? new Date(q.timestamp) : new Date(); // Timestamp yoksa şu anı al (fallback)
    return dateObj.getMonth() === currentMonth;
  });
  
  const totalQuestions = monthlyQuestions.reduce((acc, curr) => acc + curr.count, 0);

  // Grafik verisi hazırlama
  const chartDataRaw = {};
  monthlyQuestions.forEach(q => {
    // Tarih formatı DD.MM.YYYY varsayılıyor
    const dateParts = q.date ? q.date.split('.') : [];
    const shortDate = dateParts.length >= 2 ? `${dateParts[0]}.${dateParts[1]}` : '??';
    
    if (!chartDataRaw[shortDate]) chartDataRaw[shortDate] = { total: 0, details: [] };
    chartDataRaw[shortDate].total += q.count;
    chartDataRaw[shortDate].details.push({ lesson: q.lesson, topic: q.topic, count: q.count });
  });

  const chartData = Object.keys(chartDataRaw).map(date => ({ name: date, soru: chartDataRaw[date].total, details: chartDataRaw[date].details }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{ backgroundColor: '#1e293b', padding: '15px', border: '1px solid #8b5cf6', borderRadius: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
          <p style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>📅 {label}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {data.details.map((item, index) => (
              <div key={index} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', gap: '20px', color: '#e2e8f0' }}>
                <span style={{display:'flex', alignItems:'center', gap:'5px'}}><span style={{width:'6px', height:'6px', borderRadius:'50%', backgroundColor: '#38bdf8'}}></span>{item.lesson} - <span style={{color:'#94a3b8', fontStyle:'italic'}}>{item.topic}</span></span>
                <span style={{fontWeight:'bold', color:'#38bdf8'}}>{item.count}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '10px', paddingTop: '5px', borderTop: '1px solid #334155', textAlign: 'right', fontWeight: 'bold', color: '#a78bfa' }}>Top: {data.soru}</div>
        </div>
      );
    }
    return null;
  };

  const cardStyle = { backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', marginBottom: '20px' };
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', width: '100%' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: 'white', fontWeight: 'bold', cursor: 'pointer', width: '100%' };

  return (
    <div style={{ width: '100%', color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#8b5cf6', display: 'flex', gap: '10px' }}><Target /> Soru Takip & Analiz</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        
        {/* SOL: GİRİŞ */}
        <div style={cardStyle}>
          <h3 style={{ marginBottom: '15px', color: '#a78bfa', display:'flex', alignItems:'center', gap:'8px' }}>
             Yeni Kayıt 
             <span style={{fontSize:'10px', background:'#334155', padding:'2px 6px', borderRadius:'4px', color:'#94a3b8'}}>Max 120/Gün</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* DERS SEÇİMİ */}
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Ders:</label>
              <select style={inputStyle} value={qLesson} onChange={handleLessonChange}>
                {lessonsList.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>

            {/* KONU SEÇİMİ */}
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Konu:</label>
              <select style={inputStyle} value={qTopic} onChange={e => setQTopic(e.target.value)}>
                {curriculum[qLesson].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            
            <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
              <label style={{ fontSize: '12px', color: '#94a3b8' }}>Soru Sayısı:</label>
              <input type="number" placeholder="Max: 120" style={inputStyle} value={qCount} onChange={e => setQCount(e.target.value)} />
            </div>
            <button style={buttonStyle} onClick={addQuestion}><PlusCircle size={16} style={{marginRight:'5px', display:'inline'}}/> KAYDET</button>
          </div>
          
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ fontSize: '12px', color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '5px' }}>Son Eklenenler</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginTop: '10px' }}>
              {questions.slice().reverse().slice(0, 5).map(q => (
                <div key={q._id} style={{ padding: '10px', borderBottom: '1px solid #334155', background:'#0f172a', marginBottom:'5px', borderRadius:'6px' }}>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', fontWeight:'bold', color:'white'}}><span>{q.lesson}</span><span style={{color:'#a78bfa'}}>{q.count} Soru</span></div>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'3px'}}><span style={{fontSize:'11px', color:'#94a3b8', fontStyle:'italic'}}>{q.topic}</span><Trash2 size={12} style={{ color: '#ef4444', cursor: 'pointer' }} onClick={() => deleteQuestion(q._id)} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: GRAFİK */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap:'wrap', gap:'10px' }}>
            <div><h3 style={{ color: '#a78bfa', display:'flex', alignItems:'center', gap:'10px' }}><Layers size={18}/> Performans</h3></div>
            <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
               <Filter size={16} color='#94a3b8'/>
               <select style={{...inputStyle, width:'180px', padding:'8px', fontSize:'13px'}} value={filterLesson} onChange={e => setFilterLesson(e.target.value)}>
                 <option>TÜM DERSLER</option>
                 {lessonsList.map(l => <option key={l}>{l}</option>)}
               </select>
            </div>
          </div>
          <div style={{background: 'linear-gradient(to right, #7c3aed, #4f46e5)', padding:'15px', borderRadius:'10px', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
             <div><span style={{display:'block', fontSize:'12px', opacity:0.8}}>BU AYKİ PERFORMANS ({filterLesson === 'TÜM DERSLER' ? 'GENEL' : filterLesson})</span><span style={{fontSize:'1.8rem', fontWeight:'bold'}}>{totalQuestions} Soru</span></div>
             <Target size={32} style={{opacity:0.5}}/>
          </div>
          <div style={{ width: '100%', height: '350px' }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} cursor={{fill: '#334155', opacity: 0.4}} />
                <Legend />
                <Bar dataKey="soru" name={filterLesson === 'TÜM DERSLER' ? 'Toplam Çözülen' : filterLesson} fill={filterLesson === 'TÜM DERSLER' ? '#8b5cf6' : '#3b82f6'} radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}