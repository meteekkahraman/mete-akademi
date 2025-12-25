// client/src/components/questions/QuestionForm.jsx
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { curriculum, lessonsList } from '../../data';

export default function QuestionForm({ currentUser, onAddQuestion }) {
  const [qLesson, setQLesson] = useState(lessonsList[0]);
  const [qTopic, setQTopic] = useState(curriculum[lessonsList[0]][0]);
  const [qCount, setQCount] = useState('');

  const handleLessonChange = (e) => {
    const selectedLesson = e.target.value;
    setQLesson(selectedLesson);
    setQTopic(curriculum[selectedLesson][0]);
  };

  const handleSubmit = () => {
    const countVal = Number(qCount);
    if (!qCount || isNaN(countVal) || countVal <= 0) return alert("Lütfen geçerli bir sayı girin!");
    
    // KURAL 1: Tek seferde 120
    if (countVal > 120) return alert("❌ TEK SEFERDE LİMİT AŞIMI!\nTek seferde en fazla 120 soru girebilirsin.");

    // (Günlük toplam kontrolü ana bileşende veya backend'de yapılır, burası sadece form)
    onAddQuestion(qLesson, qTopic, countVal);
    setQCount('');
  };

  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', width: '100%' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#8b5cf6', color: 'white', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginTop:'15px' };

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', height: '100%' }}>
      <h3 style={{ marginBottom: '15px', color: '#a78bfa', display:'flex', alignItems:'center', gap:'8px' }}>
         Yeni Kayıt <span style={{fontSize:'10px', background:'#ef4444', padding:'2px 6px', borderRadius:'4px', color:'white', fontWeight:'bold'}}>LİMİT: 120/Gün</span>
      </h3>
      
      <div style={{display:'flex', flexDirection:'column', gap:'15px'}}>
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom:'5px', display:'block' }}>Ders:</label>
          <select style={inputStyle} value={qLesson} onChange={handleLessonChange}>
            {lessonsList.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom:'5px', display:'block' }}>Konu:</label>
          <select style={inputStyle} value={qTopic} onChange={e => setQTopic(e.target.value)}>
            {curriculum[qLesson].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        
        <div>
          <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom:'5px', display:'block' }}>Soru Sayısı (Max 120):</label>
          <input type="number" placeholder="Örn: 50" style={inputStyle} value={qCount} onChange={e => setQCount(e.target.value)} />
        </div>
      </div>

      <button style={buttonStyle} onClick={handleSubmit}>
        <PlusCircle size={16} style={{marginRight:'5px', display:'inline'}}/> KAYDET
      </button>
    </div>
  );
}