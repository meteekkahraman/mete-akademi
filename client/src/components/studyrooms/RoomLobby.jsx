// client/src/components/studyrooms/RoomLobby.jsx
import React from 'react';
import { Disc, Book, Coffee, Moon, Volume2 } from 'lucide-react';

export default function RoomLobby({ activeUsers, onJoinRequest }) {
  
  const categories = [
    { id: 'lib', name: 'Sessiz Salon', icon: <Book size={32}/>, color: '#3b82f6', desc: 'Tam odaklanma, çıt yok.' },
    { id: 'cafe', name: 'Study Cafe', icon: <Coffee size={32}/>, color: '#f59e0b', desc: 'Hafif müzik eşliğinde.' },
    { id: 'night', name: 'Gece Vardiyası', icon: <Moon size={32}/>, color: '#8b5cf6', desc: 'Uyumayanlar kulübü.' },
    { id: 'camp', name: 'Kamp Alanı', icon: <Volume2 size={32}/>, color: '#10b981', desc: 'Doğa sesleri.' },
  ];

  return (
    <div>
      <h2 style={{color:'white', marginBottom:'30px', display:'flex', gap:'10px', alignItems:'center'}}><Disc/> Sanal Kütüphane Lobisi</h2>
      
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'30px'}}>
        {categories.map(cat => (
          <div key={cat.id} style={{background:'#1e293b', padding:'30px', borderRadius:'20px', border:'1px solid #334155'}}>
            <div style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'20px'}}>
               <div style={{padding:'15px', background: `${cat.color}20`, borderRadius:'15px', color: cat.color}}>{cat.icon}</div>
               <div>
                 <h3 style={{color:'white', fontSize:'1.2rem', margin:0}}>{cat.name}</h3>
                 <span style={{color:'#94a3b8', fontSize:'12px'}}>{cat.desc}</span>
               </div>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
               {[...Array(6)].map((_, i) => { // Her kategoride 6 oda
                 const roomId = `${cat.id}_${i}`;
                 const count = activeUsers.filter(u => u.currentRoom.id === roomId).length;
                 const isFull = count >= 15;
                 
                 return (
                   <button key={i} onClick={() => !isFull && onJoinRequest(cat.id, i, cat.name)} 
                           disabled={isFull}
                           style={{
                             background: '#0f172a', border:'1px solid #334155', borderRadius:'10px', padding:'10px', 
                             color:'white', cursor: isFull?'not-allowed':'pointer', textAlign:'left',
                             display:'flex', justifyContent:'space-between', alignItems:'center', opacity: isFull?0.5:1,
                             transition:'0.2s'
                           }}>
                      <span style={{fontSize:'13px', fontWeight:'bold'}}>Salon {i+1}</span>
                      <span style={{fontSize:'11px', background: isFull?'#ef4444':cat.color, padding:'2px 6px', borderRadius:'6px', color:'white'}}>{count}/15</span>
                   </button>
                 )
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}