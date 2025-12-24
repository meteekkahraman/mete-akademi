import React, { useState, useEffect } from 'react';
import { Book, Coffee, Moon, Volume2, User, LogOut, Disc } from 'lucide-react';
import RoomModal from './RoomModal';

export default function StudyRooms({ currentUser }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentView, setCurrentView] = useState('lobby'); // 'lobby' veya 'room'
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeRoomName, setActiveRoomName] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);

  const categories = [
    { id: 'lib', name: 'Sessiz Salon', icon: <Book size={32}/>, color: '#3b82f6', desc: 'Tam odaklanma, çıt yok.' },
    { id: 'cafe', name: 'Study Cafe', icon: <Coffee size={32}/>, color: '#f59e0b', desc: 'Hafif müzik eşliğinde.' },
    { id: 'night', name: 'Gece Vardiyası', icon: <Moon size={32}/>, color: '#8b5cf6', desc: 'Uyumayanlar kulübü.' },
    { id: 'camp', name: 'Kamp Alanı', icon: <Volume2 size={32}/>, color: '#10b981', desc: 'Doğa sesleri.' },
  ];

  useEffect(() => {
    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 3000); // 3 saniyede bir güncelle (Canlı hissi)
    return () => clearInterval(interval);
  }, []);

  const fetchActiveUsers = async () => {
    try { const res = await fetch('http://127.0.0.1:5002/api/rooms/active'); setActiveUsers(await res.json()); } catch(e) {}
  };

  const handleJoinRequest = (catId, roomIndex, catName) => {
    setTargetRoom({ id: `${catId}_${roomIndex}`, name: `${catName} #${roomIndex+1}` });
    setShowModal(true);
  };

  const joinRoom = async (roomId, topic) => {
    await fetch('http://127.0.0.1:5002/api/rooms/join', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser, roomId, topic })
    });
    setShowModal(false);
    setActiveRoomId(roomId);
    setActiveRoomName(targetRoom.name);
    setCurrentView('room');
    fetchActiveUsers();
  };

  const leaveRoom = async () => {
    await fetch('http://127.0.0.1:5002/api/rooms/leave', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser })
    });
    setCurrentView('lobby');
    setActiveRoomId(null);
    fetchActiveUsers();
  };

  // --- ODA İÇİ GÖRÜNÜMÜ (SINIF) ---
  if (currentView === 'room') {
    // Odadaki kullanıcıları bul
    const usersInThisRoom = activeUsers.filter(u => u.currentRoom.id === activeRoomId);
    
    return (
      <div style={{width:'100%', animation:'fadeIn 0.5s'}}>
        {/* ODA BAŞLIĞI */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px', background:'#1e293b', padding:'20px', borderRadius:'15px', border:'1px solid #334155'}}>
           <div>
             <h2 style={{margin:0, color:'white', display:'flex', alignItems:'center', gap:'10px'}}>
               <div style={{width:'10px', height:'10px', borderRadius:'50%', background:'#10b981', boxShadow:'0 0 10px #10b981'}}></div>
               {activeRoomName}
             </h2>
             <span style={{color:'#94a3b8', fontSize:'14px'}}>Sınıfta <b>{usersInThisRoom.length}</b> kişi var</span>
           </div>
           <button onClick={leaveRoom} style={{background:'#ef4444', color:'white', border:'none', padding:'10px 20px', borderRadius:'10px', cursor:'pointer', fontWeight:'bold', display:'flex', gap:'10px', alignItems:'center'}}>
             <LogOut size={18}/> SINIFTAN ÇIK
           </button>
        </div>

        {/* OTURMA PLANI (GRID) */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
          {[...Array(15)].map((_, i) => {
            const user = usersInThisRoom[i]; // Sırayla masalara oturt
            
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
      </div>
    );
  }

  // --- LOBİ GÖRÜNÜMÜ ---
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
                   <button key={i} onClick={() => !isFull && handleJoinRequest(cat.id, i, cat.name)} 
                           disabled={isFull}
                           style={{
                             background: '#0f172a', border:'1px solid #334155', borderRadius:'10px', padding:'10px', 
                             color:'white', cursor: isFull?'not-allowed':'pointer', textAlign:'left',
                             display:'flex', justifyContent:'space-between', alignItems:'center', opacity: isFull?0.5:1,
                             transition:'0.2s', ':hover':{borderColor: cat.color}
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

      {showModal && <RoomModal room={targetRoom} onClose={()=>setShowModal(false)} onJoin={joinRoom}/>}
      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>
    </div>
  );
}