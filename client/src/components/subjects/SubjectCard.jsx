// client/src/components/subjects/SubjectCard.jsx
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { curriculum } from '../../data';
import TopicItem from './TopicItem';

export default function SubjectCard({ lesson, completedTopics, expandedLesson, setExpandedLesson, onToggle, onDetail }) {
  
  const calculateProgress = () => {
    const total = curriculum[lesson].length;
    const completed = curriculum[lesson].filter(topic => completedTopics.includes(`${lesson}-${topic}`)).length;
    return Math.round((completed / total) * 100);
  };

  const percent = calculateProgress();
  const isOpen = expandedLesson === lesson;

  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155', marginBottom: '15px', overflow: 'hidden' };
  const headerStyle = { padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a' };

  const toggleAccordion = () => {
    if (expandedLesson === lesson) setExpandedLesson(null);
    else setExpandedLesson(lesson);
  };

  return (
    <div style={cardStyle}>
      {/* BAŞLIK VE PROGRESS BAR */}
      <div style={headerStyle} onClick={toggleAccordion}>
        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
          {isOpen ? <ChevronDown color='#38bdf8'/> : <ChevronRight color='#94a3b8'/>}
          <span style={{fontWeight:'bold', fontSize:'1.1rem', color:'white'}}>{lesson}</span>
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
          {curriculum[lesson].map(topic => (
            <TopicItem 
              key={topic} 
              lesson={lesson} 
              topic={topic} 
              isCompleted={completedTopics.includes(`${lesson}-${topic}`)}
              onToggle={onToggle}
              onDetail={onDetail}
            />
          ))}
        </div>
      )}
    </div>
  );
}