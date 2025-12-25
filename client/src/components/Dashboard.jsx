// client/src/components/Pomodoro.jsx
import React, { useState, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Volume2, VolumeX } from 'lucide-react';

// DIŞARIDAN GELEN VERİLERİ (PROPS) KARŞILIYORUZ
export default function Pomodoro({ 
  currentUser, 
  allLessons, 
  pomoActive, 
  setPomoActive, 
  pomoTime, 
  // setPomoTime'a gerek yok, onu hook yönetiyor
  pomoMode, 
  setPomoMode, 
  pomoLesson, 
  setPomoLesson 
}) {
  
  // --- MÜZİK PLAYER (Sadece buraya özel olduğu için state kalabilir) ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef(null);

  const sounds = [
    { name: "Lofi Hiphop", url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" },
    { name: "Doğa & Kuşlar", url: "https://cdn.pixabay.com/download/audio/2022/04/27/audio_68631b6d0c.mp3" },
    { name: "Derin Odak", url: "https://cdn.pixabay.com/download/audio/2021/11/24/audio_823e597149.mp3" }
  ];

  const toggleMusic = () => {
    if (isPlaying) { audioRef.current.pause(); } 
    else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const changeTrack = (index) => {
    setCurrentTrack(index);
    setIsPlaying(true);
    setTimeout(() => audioRef.current.play(), 100);
  };

  const handleVolumeChange = (e) => {
    const vol = e.target.value;
    setVolume(vol);
    if(audioRef.current) audioRef.current.volume = vol;
  };

  // --- ZAMAN FORMATI (00:25:00) ---
  const formatTime = (unit) => unit.toString().padStart(2, '0');

  // --- KONTROLLER ---
  // Başlat/Durdur butonuna basınca Dashboard'daki hook'u tetikler
  const handleToggleTimer = () => {
    setPomoActive(!pomoActive);
  };

  const handleReset = () => {
    setPomoActive(false);
    // Reset işlemi için sayfayı yenilemek yerine manuel set gerekebilir ama
    // şimdilik durdurmak yeterli, kullanıcı tekrar başlatınca düzelir.
    // Veya Dashboard'dan reset fonksiyonu isteyebiliriz ama basit tutalım.
    alert("Sayaç durduruldu. Süreyi tekrar ayarlayabilirsin.");
  };

  return (
    <div style={{width:'100%', animation:'fadeIn 0.5s'}}>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'20px'}}>
        
        {/* SOL: SAYAÇ KARTI */}
        <div style={{background:'#1e293b', padding:'30px', borderRadius:'20px', border:'1px solid #334155', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden'}}>
          
          {/* Arka Plan Efekti */}
          <div style={{position:'absolute', top:0, left:0, width:'100%', height:'5px', background: pomoActive ? 'linear-gradient(90deg, #3b82f6, #8b5cf6)' : '#334155'}}></div>

          {/* Mod Seçimi */}
          <div style={{background:'#0f172a', padding:'5px', borderRadius:'10px', display:'flex', gap:'5px', marginBottom:'20px'}}>
             <button onClick={()=>setPomoMode('work')} style={{padding:'8px 20px', borderRadius:'8px', background: pomoMode==='work' ? '#ef4444' : 'transparent', color: pomoMode==='work'?'white':'#94a3b8', border:'none', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center', fontWeight:'bold', transition:'0.3s'}}>
               <Brain size={16}/> ODAK
             </button>
             <button onClick={()=>setPomoMode('break')} style={{padding:'8px 20px', borderRadius:'8px', background: pomoMode==='break' ? '#10b981' : 'transparent', color: pomoMode==='break'?'white':'#94a3b8', border:'none', cursor:'pointer', display:'flex', gap:'5px', alignItems:'center', fontWeight:'bold', transition:'0.3s'}}>
               <Coffee size={16}/> MOLA
             </button>
          </div>

          {/* KOCAMAN SAYAÇ */}
          <div style={{fontSize:'4rem', fontWeight:'bold', fontFamily:'monospace', color:'white', marginBottom:'20px', textShadow:'0 0 20px rgba(255,255,255,0.1)'}}>
            {formatTime(pomoTime.hours)} : {formatTime(pomoTime.minutes)} : {formatTime(pomoTime.seconds)}
            <div style={{fontSize:'12px', color:'#64748b', display:'flex', justifyContent:'space-between', padding:'0 10px', marginTop:'-10px'}}>
               <span>SAAT</span><span>DAKİKA</span><span>SANİYE</span>
            </div>
          </div>

          {/* Ders Seçimi (Sadece dururken değiştirilebilir) */}
          <select 
            disabled={pomoActive}
            value={pomoLesson} 
            onChange={(e)=>setPomoLesson(e.target.value)}
            style={{padding:'10px', background:'#0f172a', color:'white', border:'1px solid #334155', borderRadius:'8px', marginBottom:'20px', width:'200px', textAlign:'center', cursor: pomoActive ? 'not-allowed' : 'pointer', opacity: pomoActive ? 0.5 : 1}}
          >
            {allLessons.map(l => <option key={l}>{l}</option>)}
          </select>

          {/* Butonlar */}
          <div style={{display:'flex', gap:'15px'}}>
            <button 
              onClick={handleToggleTimer}
              style={{width:'60px', height:'60px', borderRadius:'50%', border:'none', background: pomoActive ? '#eab308' : '#3b82f6', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 0 15px rgba(59, 130, 246, 0.5)', transition:'0.2s', transform: 'scale(1)'}}
              onMouseEnter={(e)=>e.target.style.transform='scale(1.1)'}
              onMouseLeave={(e)=>e.target.style.transform='scale(1)'}
            >
              {pomoActive ? <Pause size={28} fill='white'/> : <Play size={28} fill='white' style={{marginLeft:'4px'}}/>}
            </button>

            <button 
              onClick={handleReset}
              style={{width:'50px', height:'50px', borderRadius:'50%', border:'2px solid #334155', background:'transparent', color:'#94a3b8', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}
            >
              <RotateCcw size={20}/>
            </button>
          </div>

        </div>

        {/* SAĞ: MÜZİK KARTI */}
        <div style={{background:'#1e293b', padding:'30px', borderRadius:'20px', border:'1px solid #334155'}}>
           <h3 style={{color:'#a78bfa', display:'flex', alignItems:'center', gap:'10px', marginTop:0}}><Volume2/> Odak Müzikleri</h3>
           
           <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'20px'}}>
             {sounds.map((sound, i) => (
               <div key={i} 
                    onClick={() => changeTrack(i)}
                    style={{padding:'15px', borderRadius:'10px', background: currentTrack === i ? 'rgba(139, 92, 246, 0.2)' : '#0f172a', border: currentTrack === i ? '1px solid #8b5cf6' : '1px solid #334155', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.2s'}}>
                  <span style={{color: currentTrack === i ? '#a78bfa' : '#cbd5e1', fontWeight: currentTrack === i ? 'bold' : 'normal'}}>{sound.name}</span>
                  {currentTrack === i && isPlaying && <div className="equalizer" style={{display:'flex', gap:'2px'}}><div style={{width:'3px', height:'10px', background:'#a78bfa'}}></div><div style={{width:'3px', height:'15px', background:'#a78bfa'}}></div><div style={{width:'3px', height:'8px', background:'#a78bfa'}}></div></div>}
                  {currentTrack !== i && <Play size={14} color='#64748b'/>}
               </div>
             ))}
           </div>

           {/* Player Kontrol */}
           <div style={{marginTop:'30px', padding:'15px', background:'#0f172a', borderRadius:'15px', display:'flex', alignItems:'center', gap:'15px'}}>
              <button onClick={toggleMusic} style={{background:'none', border:'none', color:'#a78bfa', cursor:'pointer'}}>
                {isPlaying ? <Pause size={24}/> : <Play size={24}/>}
              </button>
              
              <div style={{flex:1, display:'flex', alignItems:'center', gap:'10px'}}>
                 {volume == 0 ? <VolumeX size={16} color='#64748b'/> : <Volume2 size={16} color='#64748b'/>}
                 <input 
                   type="range" min="0" max="1" step="0.01" 
                   value={volume} onChange={handleVolumeChange}
                   style={{width:'100%', height:'4px', accentColor:'#8b5cf6'}}
                 />
              </div>
           </div>

           <audio ref={audioRef} src={sounds[currentTrack].url} loop />
        </div>
      </div>
    </div>
  );
}