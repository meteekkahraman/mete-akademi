// client/src/components/pomodoro/TimerDisplay.jsx
import React from 'react';
import { Brain, Coffee } from 'lucide-react';

export default function TimerDisplay({ pomoMode, setPomoMode, pomoTime, handleTimeChange, setPomoActive, setPomoTime }) {
  
  const changeMode = (mode) => {
    setPomoMode(mode);
    setPomoActive(false);
    setPomoTime({ hours: 0, minutes: mode === 'work' ? 25 : 5, seconds: 0 });
  };

  // STİLLER
  const activeModeStyle = (color) => ({ padding: '10px 25px', borderRadius: '12px', backgroundColor: color, color: 'white', border:'none', fontWeight: 'bold', cursor: 'pointer', display:'flex', gap:'8px', transition:'0.3s' });
  const passiveModeStyle = { padding: '10px 25px', borderRadius: '12px', backgroundColor: 'transparent', color: '#94a3b8', border:'1px solid #475569', fontWeight: 'bold', cursor: 'pointer', display:'flex', gap:'8px', transition:'0.3s' };
  
  // Kutunun rengini moda göre ayarla
  const clockContainerStyle = (mode) => ({ 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    backgroundColor: '#0f172a', padding: '20px 30px', borderRadius: '20px', 
    border: `2px solid ${mode==='work' ? '#ef4444' : '#10b981'}`, 
    boxShadow: `0 0 20px ${mode==='work' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` 
  });

  const bigInputStyle = { backgroundColor:'transparent', border:'none', color:'white', fontSize:'3rem', fontWeight:'bold', fontFamily: "'Courier New', monospace", width:'80px', textAlign:'center', outline:'none' };
  const labelStyle = { fontSize:'0.7rem', color:'#64748b', fontWeight:'bold', marginTop:'-5px' };
  const timeBox = { display:'flex', flexDirection:'column', alignItems:'center' };
  const colonStyle = { fontSize:'3rem', color:'#64748b', margin:'0 5px', paddingBottom:'20px' };

  // Helper: Tek haneli sayıları 0 ile göster (Sadece görüntü için, input değeri için değil)
  // Input değeri raw (ham) kalmalı ki rahat yazılabilsin.
  return (
    <div>
      {/* MOD SEÇİMİ */}
      <div style={{display:'flex', justifyContent:'center', gap:'15px', marginBottom:'25px'}}>
          <button onClick={() => changeMode('work')} style={pomoMode === 'work' ? activeModeStyle('#ef4444') : passiveModeStyle}><Brain size={20}/> ODAK</button>
          <button onClick={() => changeMode('break')} style={pomoMode === 'break' ? activeModeStyle('#10b981') : passiveModeStyle}><Coffee size={20}/> MOLA</button>
      </div>

      {/* DİJİTAL SAAT */}
      <div style={clockContainerStyle(pomoMode)}>
        {/* SAAT */}
        <div style={timeBox}>
          <input 
            type="number" 
            min="0"
            value={pomoTime.hours} // padStart sildik
            onChange={e=>handleTimeChange(e,'hours')} 
            style={bigInputStyle}
            placeholder="00"
          />
          <span style={labelStyle}>SAAT</span>
        </div>
        
        <span style={colonStyle}>:</span>
        
        {/* DAKİKA */}
        <div style={timeBox}>
          <input 
            type="number" 
            min="0" max="59"
            value={pomoTime.minutes} // padStart sildik
            onChange={e=>handleTimeChange(e,'minutes')} 
            style={bigInputStyle}
            placeholder="00"
          />
          <span style={labelStyle}>DAKİKA</span>
        </div>
        
        <span style={colonStyle}>:</span>
        
        {/* SANİYE */}
        <div style={timeBox}>
          <input 
            type="number" 
            min="0" max="59"
            value={pomoTime.seconds} // padStart sildik
            onChange={e=>handleTimeChange(e,'seconds')} 
            style={bigInputStyle}
            placeholder="00"
          />
          <span style={labelStyle}>SANİYE</span>
        </div>
      </div>
    </div>
  );
}