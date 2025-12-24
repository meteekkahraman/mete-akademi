import React, { useState, useEffect } from 'react';
import { Trophy, Users, UserPlus } from 'lucide-react';

export default function LeagueTable({ currentUser }) {
  const [period, setPeriod] = useState('weekly'); // daily, weekly, monthly, friends
  const [leaderboard, setLeaderboard] = useState([]);
  const [friendEmail, setFriendEmail] = useState('');

  const fetchLeaderboard = async () => {
    const res = await fetch(`http://127.0.0.1:5002/api/leaderboard?period=${period}&username=${currentUser}`);
    setLeaderboard(await res.json());
  };

  useEffect(() => { fetchLeaderboard(); }, [period]);

  const addFriend = async () => {
    if(!friendEmail) return;
    const res = await fetch('http://127.0.0.1:5002/api/friends/add', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({currentUser, friendEmail})
    });
    const data = await res.json();
    alert(data.msg || data.error);
    if(res.ok) { setFriendEmail(''); if(period==='friends') fetchLeaderboard(); }
  };

  const btnStyle = (p) => ({ flex:1, padding:'10px', background: period===p ? '#3b82f6':'#0f172a', border:'1px solid #334155', color: period===p?'white':'#94a3b8', cursor:'pointer', fontWeight:'bold', fontSize:'13px' });

  return (
    <div style={{backgroundColor: '#1e293b', padding: '20px', borderRadius: '15px', border: '1px solid #334155'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px', flexWrap:'wrap', gap:'10px'}}>
        <h2 style={{color:'#facc15', display:'flex', gap:'10px', alignItems:'center'}}><Trophy /> Liderlik Tablosu</h2>
        <div style={{display:'flex', borderRadius:'8px', overflow:'hidden', border:'1px solid #334155'}}>
          <button onClick={()=>setPeriod('daily')} style={btnStyle('daily')}>Günlük</button>
          <button onClick={()=>setPeriod('weekly')} style={btnStyle('weekly')}>Haftalık</button>
          <button onClick={()=>setPeriod('monthly')} style={btnStyle('monthly')}>Aylık</button>
          <button onClick={()=>setPeriod('friends')} style={btnStyle('friends')}>Arkadaşlar</button>
        </div>
      </div>

      {period === 'friends' && (
        <div style={{marginBottom:'20px', padding:'15px', background:'#0f172a', borderRadius:'10px', display:'flex', gap:'10px', alignItems:'center'}}>
           <span style={{color:'#94a3b8', fontSize:'13px'}}>Arkadaş Ekle:</span>
           <input placeholder="arkadas@mail.com" value={friendEmail} onChange={e=>setFriendEmail(e.target.value)} style={{padding:'8px', borderRadius:'5px', border:'1px solid #334155', background:'#1e293b', color:'white', flex:1}}/>
           <button onClick={addFriend} style={{padding:'8px 15px', background:'#10b981', border:'none', borderRadius:'5px', color:'white', cursor:'pointer'}}><UserPlus size={16}/></button>
        </div>
      )}
      
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left', color:'#94a3b8', borderBottom:'1px solid #475569'}}>
            <th style={{padding:'10px'}}>#</th>
            <th style={{padding:'10px'}}>Öğrenci</th>
            <th style={{padding:'10px'}}>Süre</th>
            <th style={{padding:'10px'}}>Favori Ders</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length === 0 ? <tr><td colSpan="4" style={{padding:'20px', textAlign:'center', color:'#64748b'}}>Veri yok.</td></tr> : leaderboard.map((user, index) => (
            <tr key={index} style={{borderBottom:'1px solid #334155', backgroundColor: user._id === currentUser ? 'rgba(59, 130, 246, 0.1)' : 'transparent'}}>
              <td style={{padding:'15px', fontWeight:'bold', color: index<3 ? '#facc15' : 'white'}}>{index + 1}</td>
              <td style={{padding:'15px', fontWeight:'bold', color:'white'}}>{user._id} {user._id === currentUser && '(Sen)'}</td>
              <td style={{padding:'15px', color:'#4ade80'}}>{Math.floor(user.totalMinutes/60)}sa {user.totalMinutes%60}dk</td>
              <td style={{padding:'15px', fontSize:'12px', color:'#a78bfa'}}>{user.favoriteLesson}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}