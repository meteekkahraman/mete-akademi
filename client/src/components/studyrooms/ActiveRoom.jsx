// client/src/components/studyrooms/ActiveRoom.jsx
import React from 'react';
import { LogOut, User } from 'lucide-react';

export default function ActiveRoom({ activeRoomName, activeRoomId, usersInRoom, currentUser, onLeave }) {
  return (
    <div style={{width:'100%', animation:'fadeIn 0.5s'}}>
      {/* ODA BAŞLIĞI */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px', background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155'}}>
         <div>
           <h2 style={{margin:0, color:'white', display:'flex', alignItems:'center', gap:'10px'}}>
             <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 10px #10b981'}}></div>
             {activeRoomName}
           </h2>
           <span style={{color:'#94a3b8', fontSize:'14px'}}>Sınıfta <b>{usersInRoom.length}</b> kişi var</span>
         </div>
         <button onClick={onLeave} style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer', fontWeight:'bold', display:'flex', gap:'10px', alignItems:'center'}}>
           <LogOut size={18}/> SINIFTAN ÇIK
         </button>
      </div>

      {/* OTURMA PLANI (GRID) */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
        {[...Array(15)].map((_, i) => {
          const user = usersInRoom[i]; // Sırayla masalara oturt
          
          if (user) {
            // DOLU MASA
            const isMe = user.username === currentUser;
            return (
              <div key={i} style={{background: isMe ? '#1e3a8a' : 'white', color: isMe ? 'white' : '#0f172a', padding:'20px', borderRadius:'20px', textAlign:'center', position:'relative', boxShadow:'0 10px 20px rgba(0,0,0,0.2)', transform: isMe ? 'scale(1.05)' : 'none', border: isMe ? '2px solid #60a5fa' : 'none'}}>
                 <div style={{width:'60px', height:'60px', borderRadius:'20px', background: isMe ? '#3b82f6' : '#e2e8f0', color: isMe ? 'white' : '#64748b', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', fontWeight:'bold', margin:'0 auto 15px auto'}}>
                   {user.username.charAt(0).toUpperCase()}
                 </div>
                 <h3 style={{fontSize:'1rem', fontWeight:'bold', margin:'0 0 5px 0'}}>{user.username} {isMe && '(Sen)'}</h3>
                 <p style={{fontSize:'0.8rem', color: isMe ? '#93c5fd' : '#64748b', textTransform:'uppercase', letterSpacing:'1px'}}>{user.title}</p>
                 
                 <div style={{marginTop:'15px', paddingTop:'15px', borderTop: isMe ? '1px solid #1e40af' : '1px solid #e2e8f0', color: isMe ? '#60a5fa' : '#3b82f6', fontWeight:'bold', fontSize:'0.9rem'}}>
                   {user.currentRoom.topic}
                 </div>
                 
                 {/* Online Işığı */}
                 <div style={{position:'absolute', top:'15px', right:'15px', width:'8px', height:'8px', borderRadius:'50%', background:'#10b981'}}></div>
              </div>
            );
          } else {
            // BOŞ MASA
            return (
              <div key={i} style={{background:'#1e293b', border:'2px dashed #334155', borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', height:'200px', color:'#334155', flexDirection:'column', gap:'10px'}}>
                 <div style={{width:'50px', height:'50px', borderRadius:'15px', background:'#0f172a', display:'flex', alignItems:'center', justifyContent:'center'}}><User size={20}/></div>
                 <span style={{fontSize:'12px', fontWeight:'bold'}}>BOŞ MASA</span>
              </div>
            );
          }
        })}
      </div>
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}