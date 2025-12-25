import React, { useEffect, useRef } from 'react';
import { Play, Music, Volume2 } from 'lucide-react';

export default function MusicPlayer({ selectedMusic, setSelectedMusic, volume, setVolume }) {
  const audioRef = useRef(new Audio());

  const musicTracks = [
    { name: 'Lofi Hiphop', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
    { name: 'Doğa & Kuşlar', url: 'https://cdn.pixabay.com/audio/2022/04/27/audio_67bcf729cf.mp3' },
    { name: 'Derin Odak', url: 'https://cdn.pixabay.com/audio/2021/11/01/audio_03468c4d28.mp3' }
  ];

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

  // STİLLER (Bu dosya özelinde)
  const cardStyle = { backgroundColor: '#1e293b', padding: '30px', borderRadius: '24px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', display:'flex', flexDirection:'column', width:'350px' };
  const activeMusicStyle = { padding:'15px', borderRadius:'12px', backgroundColor: '#8b5cf6', color:'white', border:'none', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.3s' };
  const passiveMusicStyle = { padding:'15px', borderRadius:'12px', backgroundColor: '#0f172a', color:'#94a3b8', border:'1px solid #334155', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'0.3s' };

  return (
    <div style={cardStyle}>
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
  );
}