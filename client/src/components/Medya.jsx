import React, { useState } from 'react';
import { Trophy, Globe, LayoutGrid } from 'lucide-react';
import LeagueTable from './LeagueTable';
import StudyRooms from './StudyRooms';
import AutoWall from './AutoWall';

export default function Medya({ currentUser }) {
  const [activeTab, setActiveTab] = useState('rooms'); // Varsayılan: Odalar

  const tabBtnStyle = (active) => ({ 
    padding: '12px 25px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', 
    backgroundColor: active ? '#8b5cf6' : 'transparent', color: active ? 'white' : '#94a3b8', 
    border: active ? 'none' : '1px solid #334155', display:'flex', gap:'8px', transition:'0.3s', alignItems:'center'
  });

  return (
    <div style={{ width: '100%', color: 'white' }}>
      
      {/* ÜST MENÜ (NAVİGASYON) */}
      <div style={{display:'flex', justifyContent:'center', gap:'20px', marginBottom:'40px'}}>
        <button onClick={()=>setActiveTab('rooms')} style={tabBtnStyle(activeTab==='rooms')}>
          <LayoutGrid size={20}/> ETÜT ODALARI
        </button>
        <button onClick={()=>setActiveTab('league')} style={tabBtnStyle(activeTab==='league')}>
          <Trophy size={20}/> LİGLER & SIRALAMA
        </button>
        <button onClick={()=>setActiveTab('wall')} style={tabBtnStyle(activeTab==='wall')}>
          <Globe size={20}/> BAŞARI DUVARI
        </button>
      </div>

      {/* İÇERİK ALANI */}
      <div style={{animation: 'fadeIn 0.5s'}}>
        {activeTab === 'rooms' && <StudyRooms currentUser={currentUser} />}
        {activeTab === 'league' && <LeagueTable currentUser={currentUser} />}
        {activeTab === 'wall' && <AutoWall />}
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}