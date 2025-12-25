// client/src/components/questions/QuestionChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layers, Filter, Target } from 'lucide-react';
import { lessonsList } from '../../data';

export default function QuestionChart({ chartData, totalQuestions, filterLesson, setFilterLesson }) {
  
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

  const inputStyle = { padding: '8px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', width: '180px', fontSize:'13px' };

  return (
    <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155', height:'100%' }}>
      
      {/* BAŞLIK VE FİLTRE */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap:'wrap', gap:'10px' }}>
        <div><h3 style={{ color: '#a78bfa', display:'flex', alignItems:'center', gap:'10px' }}><Layers size={18}/> Performans</h3></div>
        <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
           <Filter size={16} color='#94a3b8'/>
           <select style={inputStyle} value={filterLesson} onChange={e => setFilterLesson(e.target.value)}>
             <option>TÜM DERSLER</option>
             {lessonsList.map(l => <option key={l}>{l}</option>)}
           </select>
        </div>
      </div>

      {/* TOPLAM KART */}
      <div style={{background: 'linear-gradient(to right, #7c3aed, #4f46e5)', padding:'15px', borderRadius:'10px', marginBottom:'20px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
         <div><span style={{display:'block', fontSize:'12px', opacity:0.8}}>BU AYKİ PERFORMANS ({filterLesson === 'TÜM DERSLER' ? 'GENEL' : filterLesson})</span><span style={{fontSize:'1.8rem', fontWeight:'bold'}}>{totalQuestions} Soru</span></div>
         <Target size={32} style={{opacity:0.5}}/>
      </div>

      {/* GRAFİK */}
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
  );
}