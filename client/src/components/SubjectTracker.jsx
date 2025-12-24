import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, ChevronDown, ChevronRight, PieChart } from 'lucide-react';
import { curriculum } from '../data'; // <-- VERİYİ MERKEZDEN ÇEKİYORUZ

export default function SubjectTracker({ currentUser }) {
  const [completedTopics, setCompletedTopics] = useState([]);
  const [expandedLesson, setExpandedLesson] = useState(null);

  const fetchProgress = async () => {
    const res = await fetch(`http://localhost:5001/api/progress?username=${currentUser}`);
    const data = await res.json();
    const formatted = data.map(item => `${item.lesson}-${item.topic}`);
    setCompletedTopics(formatted);
  };

  useEffect(() => { fetchProgress(); }, [currentUser]);

  const toggleTopic = async (lesson, topic) => {
    await fetch('http://localhost:5001/api/progress', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, lesson, topic })
    });
    const key = `${lesson}-${topic}`;
    if (completedTopics.includes(key)) setCompletedTopics(completedTopics.filter(t => t !== key));
    else setCompletedTopics([...completedTopics, key]);
  };

  const calculateProgress = (lesson) => {
    const total = curriculum[lesson].length;
    const completed = curriculum[lesson].filter(topic => completedTopics.includes(`${lesson}-${topic}`)).length;
    return Math.round((completed / total) * 100);
  };

  const toggleAccordion = (lesson) => {
    if (expandedLesson === lesson) setExpandedLesson(null);
    else setExpandedLesson(lesson);
  };

  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155', marginBottom: '15px', overflow: 'hidden' };
  const headerStyle = { padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' };
  const topicStyle = { padding: '12px 20px', borderTop: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: '0.2s' };
  
  return (
    <div style={{ width: '100%', color: 'white' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', color: '#38bdf8', display: 'flex', gap: '10px' }}><PieChart /> Konu Takip Sistemi</h2>
      <p style={{color:'#94a3b8', marginBottom:'20px'}}>Bitirdiğin konuları işaretle, ilerlemeni gör.</p>

      {Object.keys(curriculum).map(lesson => {
        const percent = calculateProgress(lesson);
        const isOpen = expandedLesson === lesson;

        return (
          <div key={lesson} style={cardStyle}>
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
            {isOpen && (
              <div style={{backgroundColor:'#1e293b'}}>
                {curriculum[lesson].map(topic => {
                  const isDone = completedTopics.includes(`${lesson}-${topic}`);
                  return (
                    <div key={topic} style={{...topicStyle, backgroundColor: isDone ? 'rgba(56, 189, 248, 0.1)' : 'transparent'}} onClick={() => toggleTopic(lesson, topic)}>
                      {isDone ? <CheckSquare size={20} color='#38bdf8' fill='#38bdf8' fillOpacity={0.2}/> : <Square size={20} color='#64748b'/>}
                      <span style={{color: isDone ? 'white' : '#94a3b8'}}>{topic}</span>
                      {isDone && <span style={{marginLeft:'auto', fontSize:'10px', backgroundColor:'#38bdf8', color:'black', padding:'2px 6px', borderRadius:'10px', fontWeight:'bold'}}>TAMAMLANDI</span>}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
}