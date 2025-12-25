import React from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TimerControls({ toggleTimer, resetTimer, pomoActive, isLimitReached }) {
  
  // Stiller
  const playBtnStyle = { width:'70px', height:'70px', borderRadius:'50%', border:'none', backgroundColor:'#3b82f6', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)', transition:'0.2s' };
  const pauseBtnStyle = { ...playBtnStyle, backgroundColor:'#f59e0b', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.5)' };
  const disabledBtnStyle = { ...playBtnStyle, backgroundColor:'#475569', cursor:'not-allowed', boxShadow:'none', opacity: 0.5 };
  const resetBtnStyle = { width:'70px', height:'70px', borderRadius:'50%', border:'2px solid #475569', backgroundColor:'transparent', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'0.2s' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
      <button 
        onClick={toggleTimer} 
        disabled={isLimitReached} 
        style={isLimitReached ? disabledBtnStyle : (pomoActive ? pauseBtnStyle : playBtnStyle)}
      >
        {pomoActive ? <Pause size={28} /> : <Play size={28} fill="white" />}
      </button>
      
      <button onClick={resetTimer} style={resetBtnStyle}>
        <RotateCcw size={24} />
      </button>
    </div>
  );
}