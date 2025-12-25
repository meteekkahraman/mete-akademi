// client/src/components/StudyRooms.jsx
import React, { useState, useEffect } from 'react';

// Alt Bileşenler (studyrooms klasöründen)
import RoomLobby from './studyrooms/RoomLobby';
import ActiveRoom from './studyrooms/ActiveRoom';
import JoinRoomModal from './studyrooms/JoinRoomModal';

export default function StudyRooms({ currentUser }) {
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentView, setCurrentView] = useState('lobby'); // 'lobby' veya 'room'
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [activeRoomName, setActiveRoomName] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [targetRoom, setTargetRoom] = useState(null);

  useEffect(() => {
    fetchActiveUsers();
    const interval = setInterval(fetchActiveUsers, 3000); // 3 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  const fetchActiveUsers = async () => {
    try { const res = await fetch('https://mete-akademi.onrender.com/api/rooms/active'); setActiveUsers(await res.json()); } catch(e) {}
  };

  const handleJoinRequest = (catId, roomIndex, catName) => {
    setTargetRoom({ id: `${catId}_${roomIndex}`, name: `${catName} #${roomIndex+1}` });
    setShowModal(true);
  };

  const joinRoom = async (roomId, topic) => {
    await fetch('https://mete-akademi.onrender.com/api/rooms/join', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser, roomId, topic })
    });
    setShowModal(false);
    setActiveRoomId(roomId);
    setActiveRoomName(targetRoom.name);
    setCurrentView('room');
    fetchActiveUsers();
  };

  const leaveRoom = async () => {
    await fetch('https://mete-akademi.onrender.com/api/rooms/leave', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ username: currentUser })
    });
    setCurrentView('lobby');
    setActiveRoomId(null);
    fetchActiveUsers();
  };

  return (
    <div>
      {/* 1. ODA İÇİ GÖRÜNÜMÜ */}
      {currentView === 'room' && (
        <ActiveRoom 
           activeRoomName={activeRoomName}
           activeRoomId={activeRoomId}
           usersInRoom={activeUsers.filter(u => u.currentRoom.id === activeRoomId)}
           currentUser={currentUser}
           onLeave={leaveRoom}
        />
      )}

      {/* 2. LOBİ GÖRÜNÜMÜ */}
      {currentView === 'lobby' && (
        <RoomLobby 
           activeUsers={activeUsers}
           onJoinRequest={handleJoinRequest}
        />
      )}

      {/* 3. GİRİŞ MODALI */}
      {showModal && (
        <JoinRoomModal 
           room={targetRoom} 
           onClose={()=>setShowModal(false)} 
           onJoin={joinRoom}
        />
      )}
    </div>
  );
}