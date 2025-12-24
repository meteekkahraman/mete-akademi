import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Music, Volume2, Brain, Coffee, BadgeCheck } from 'lucide-react';

export default function Pomodoro({ 
  currentUser, allLessons, 
  pomoActive, setPomoActive, 
  pomoMode, setPomoMode, 
  pomoTime, setPomoTime, 
  pomoLesson, setPomoLesson 
}) {
  const [selectedMusic, setSelectedMusic] = useState('');
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(new Audio());

  // --- YENİ EKLENEN: MAVİ ROZET (TOP 3 KONTROLÜ) ---
  const [isTop3, setIsTop3] = useState(false);

  useEffect(() => {
    // Haftalık sıralamayı kontrol et
    const checkRank = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5002/api/leaderboard?period=weekly');
        const data = await res.json();
        // İlk 3 kişiden biri ben miyim?
        const myRank = data.findIndex(u => u._id === currentUser);
        if (myRank !== -1 && myRank < 3) setIsTop3(true);
        else setIsTop3(false);
      } catch(e) {
        console.error("Sıralama kontrol hatası:", e);
      }
    };
    checkRank();
  }, [currentUser]);
  // --------------------------------------------------

  // --- MÜZİK LİSTESİ ---
  const musicTracks = [
    { name: 'Lofi Hiphop', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { name: 'Doğa & Kuşlar', url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcf729cf.mp3' },
    { name: 'Derin Odak', url: 'https://cdn.pixabay.com/audio/2021/11/01/audio_03468c4d28.mp3' }
  ];

  // Müzik Kontrol
  useEffect(() => {
    if (selectedMusic) {
      audioRef.current.src = selectedMusic;
      audioRef.current.volume = volume;
      audioRef.current.loop = true;
      audioRef.current.play().catch(() => {});
    } else { 
      audioRef.current.pause(); 
    }
    return () => audioRef.current.pause();
  }, [selectedMusic]);

  useEffect(() => { audioRef.current.volume = volume; }, [volume]);

  // Sayaç Fonksiyonları
  const toggleTimer = () => setPomoActive(!pomoActive);
  
  const resetTimer = () => {
    setPomoActive(false);
    setPomoTime({ hours: 0, minutes: pomoMode === 'work' ? 25 : 5, seconds: 0 });
  };

  const changeMode = (mode) => {
    setPomoMode(mode);
    setPomoActive(false);
    setPomoTime({ hours: 0, minutes: mode === 'work' ? 25 : 5, seconds: 0 });
  };

  const handleTimeChange = (e, type) => {
    if (pomoActive) return; // Sayaç çalışırken değiştirmeyi engelle
    let val = parseInt(e.target.value) || 0;
    setPomoTime(prev => ({ ...prev, [type]: val }));
  };

  return (
    <div style={{ display: 'flex', gap: '30px', justifyContent:'center', alignItems:'flex-start', flexWrap:'wrap' }}>
      <style>{`input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }`}</style>

      {/* SOL KART: SAYAÇ */}
      <div style={cardStyle}>
        
        {/* --- YENİ ROZET GÖSTERİMİ --- */}
        {isTop3 && (
          <div style={{marginBottom:'20px', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', color:'#3b82f6', background:'rgba(59, 130, 246, 0.1)', padding:'10px', borderRadius:'10px', fontWeight:'bold', fontSize:'14px', border:'1px solid rgba(59, 130, 246, 0.2)'}}>
            <BadgeCheck size={20} fill="#3b82f6" color="#1e293b"/> HAFTANIN YILDIZI
          </div>
        )}

        {/* MOD SEÇİMİ */}
        <div style={{display:'flex', justifyContent:'center', gap:'15px', marginBottom:'25px'}}>
           <button onClick={() => changeMode('work')} style={pomoMode === 'work' ? activeModeStyle('#ef4444') : passiveModeStyle}><Brain size={20}/> ODAK</button>
           <button onClick={() => changeMode('break')} style={pomoMode === 'break' ? activeModeStyle('#10b981') : passiveModeStyle}><Coffee size={20}/> MOLA</button>
        </div>

        {/* DERS SEÇİMİ (Sadece Odak Modunda) */}
        {pomoMode === 'work' && (
          <div style={{marginBottom:'25px', display:'flex', flexDirection:'column', gap:'10px', alignItems:'center'}}>
            <select value={pomoLesson} onChange={(e)=>setPomoLesson(e.target.value)} style={selectStyle}>
              {allLessons.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}

        {/* DİJİTAL SAAT */}
        <div style={clockContainerStyle(pomoMode)}>
          <div style={timeBox}><input type="number" value={pomoTime.hours.toString().padStart(2,'0')} onChange={e=>handleTimeChange(e,'hours')} style={bigInputStyle}/><span style={labelStyle}>SAAT</span></div>
          <span style={colonStyle}>:</span>
          <div style={timeBox}><input type="number" value={pomoTime.minutes.toString().padStart(2,'0')} onChange={e=>handleTimeChange(e,'minutes')} style={bigInputStyle}/><span style={labelStyle}>DAKİKA</span></div>
          <span style={colonStyle}>:</span>
          <div style={timeBox}><input type="number" value={pomoTime.seconds.toString().padStart(2,'0')} onChange={e=>handleTimeChange(e,'seconds')} style={bigInputStyle}/><span style={labelStyle}>SANİYE</span></div>
        </div>

        {/* KONTROL BUTONLARI */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button onClick={toggleTimer} style={pomoActive ? pauseBtnStyle : playBtnStyle}>{pomoActive ? <Pause size={28} /> : <Play size={28} fill="white" />}</button>
          <button onClick={resetTimer} style={resetBtnStyle}><RotateCcw size={24} /></button>
        </div>
      </div>

      {/* SAĞ KART: MÜZİK */}
      <div style={{...cardStyle, width:'350px'}}>
        <h3 style={{color:'#a78bfa', display:'flex', alignItems:'center', gap:'10px', marginBottom:'25px'}}><Music /> Odak Müzikleri</h3>
        <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
           {musicTracks.map((track, i) => (
             <div key={i} onClick={() => setSelectedMusic(selectedMusic === track.url ? '' : track.url)} style={selectedMusic === track.url ? activeMusicStyle : passiveMusicStyle}>
               <span style={{fontWeight:'500'}}>{track.name}</span>
               {selectedMusic === track.url ? <div className="animate-bounce">🎵</div> : <Play size={16} color='#94a3b8'/>}
             </div>
           ))}
        </div>
        <div style={{marginTop:'30px', backgroundColor:'#0f172a', padding:'15px', borderRadius:'12px', display:'flex', alignItems:'center', gap:'12px'}}>
           <Volume2 size={20} color='#94a3b8'/>
           <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} style={{width:'100%', cursor:'pointer', accentColor:'#8b5cf6'}}/>
        </div>
      </div>
    </div>
  );
}

// --- STİLLER ---
const cardStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column' };
const clockContainerStyle = (mode) => ({ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', padding: '20px 30px', borderRadius: '20px', border: `2px solid ${mode==='work' ? '#ef4444' : '#10b981'}`, boxShadow: `0 0 20px ${mode==='work' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}` });
const bigInputStyle = { backgroundColor:'transparent', border:'none', color:'white', fontSize:'3rem', fontWeight:'bold', fontFamily: "'Courier New', monospace", width:'80px', textAlign:'center', outline:'none' };
const labelStyle = { fontSize:'0.7rem', color:'#64748b', fontWeight:'bold', marginTop:'-5px' };
const timeBox = { display:'flex', flexDirection:'column', alignItems:'center' };
const colonStyle = { fontSize:'3rem', color:'#64748b', margin:'0 5px', paddingBottom:'20px' };
const playBtnStyle = { width:'70px', height:'70px', borderRadius:'50%', border:'none', backgroundColor:'#3b82f6', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.5)', transition:'0.2s' };
const pauseBtnStyle = { ...playBtnStyle, backgroundColor:'#f59e0b', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.5)' };
const resetBtnStyle = { width:'70px', height:'70px', borderRadius:'50%', border:'2px solid #475569', backgroundColor:'transparent', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'0.2s' };
const activeModeStyle = (color) => ({ padding: '10px 25px', borderRadius: '12px', backgroundColor: color, color: 'white', border:'none', fontWeight: 'bold', cursor: 'pointer', display:'flex', gap:'8px' });
const passiveModeStyle = { padding: '10px 25px', borderRadius: '12px', backgroundColor: 'transparent', color: '#94a3b8', border:'1px solid #475569', fontWeight: 'bold', cursor: 'pointer', display:'flex', gap:'8px' };
const selectStyle = { padding: '10px 15px', borderRadius: '10px', backgroundColor: '#0f172a', color: 'white', border: '1px solid #475569', width: '250px', outline: 'none', textAlign:'center', fontSize:'1rem' };
const activeMusicStyle = { padding:'15px', borderRadius:'12px', backgroundColor: '#8b5cf6', color:'white', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.3s' };
const passiveMusicStyle = { padding:'15px', borderRadius:'12px', backgroundColor: '#0f172a', color:'#94a3b8', border:'1px solid #334155', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.3s' };