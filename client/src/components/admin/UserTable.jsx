// client/src/components/admin/UserTable.jsx
import React, { useState } from 'react';
import { Search, Eye, Crown, ArrowUpCircle, ArrowDownCircle, CheckCircle, Ban } from 'lucide-react';

export default function UserTable({ users, toggleBan, toggleRole, openUserDetail }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'16px', border:'1px solid #334155', height:'100%', boxSizing:'border-box' };
  const actionBtnStyle = { background:'transparent', border:'1px solid #334155', padding:'8px', borderRadius:'8px', color:'#94a3b8', cursor:'pointer', marginLeft:'5px', transition:'0.2s' };

  return (
    <div style={cardStyle}>
      {/* Arama Kutusu */}
      <div style={{marginBottom:'20px', position:'relative'}}>
         <Search size={18} style={{position:'absolute', top:12, left:10, color:'#94a3b8'}}/>
         <input 
           style={{width:'100%', padding:'10px 10px 10px 35px', background:'#0f172a', border:'1px solid #334155', color:'white', borderRadius:'8px', boxSizing:'border-box'}} 
           placeholder="Öğrenci ara..." 
           value={searchTerm} 
           onChange={e=>setSearchTerm(e.target.value)}
         />
      </div>

      {/* Tablo */}
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
           <tr style={{textAlign:'left', color:'#64748b', borderBottom:'1px solid #334155', fontSize:'12px', textTransform:'uppercase'}}>
             <th style={{padding:'15px'}}>Kullanıcı</th><th style={{padding:'15px'}}>Rol</th><th style={{padding:'15px'}}>Performans</th><th style={{padding:'15px', textAlign:'right'}}>Aksiyon</th>
           </tr>
        </thead>
        <tbody>
           {users.filter(u => u.username.includes(searchTerm)).map(u => (
             <tr key={u._id} style={{borderBottom:'1px solid #1e293b', background: u.isBanned ? 'rgba(239,68,68,0.1)' : 'transparent'}}>
                <td style={{padding:'15px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                    <div style={{width:'32px', height:'32px', borderRadius:'8px', background: u.role==='admin'?'#ef4444':'#3b82f6', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold'}}>{u.username[0].toUpperCase()}</div>
                    <div><div style={{fontWeight:'bold'}}>{u.username}</div><div style={{fontSize:'11px', color:'#64748b'}}>{u.email}</div></div>
                  </div>
                </td>
                <td style={{padding:'15px'}}>
                   {u.role === 'admin' 
                     ? <span style={{color:'#ef4444', fontWeight:'bold', display:'flex', gap:'5px', alignItems:'center'}}><Crown size={14}/> Yönetici</span> 
                     : <span style={{color:'#94a3b8'}}>Öğrenci</span>
                   }
                </td>
                <td style={{padding:'15px'}}>
                   <div style={{display:'flex', gap:'10px'}}>
                      <div style={{background:'#0f172a', padding:'5px 10px', borderRadius:'6px', fontSize:'12px', border:'1px solid #334155'}}><span style={{color:'#94a3b8'}}>Bugün:</span> <span style={{color:'#10b981', fontWeight:'bold'}}>{u.dailyMinutes}dk</span></div>
                      <div style={{background:'#0f172a', padding:'5px 10px', borderRadius:'6px', fontSize:'12px', border:'1px solid #334155'}}><span style={{color:'#94a3b8'}}>Hafta:</span> <span style={{color:'#3b82f6', fontWeight:'bold'}}>{u.weeklyMinutes}dk</span></div>
                   </div>
                </td>
                <td style={{padding:'15px', textAlign:'right'}}>
                   <div style={{display:'flex', justifyContent:'flex-end', gap:'5px'}}>
                      <button onClick={()=>openUserDetail(u)} style={actionBtnStyle} title="İncele"><Eye size={16}/></button>
                      <button onClick={()=>toggleRole(u._id)} style={{...actionBtnStyle, color:'#f59e0b'}} title="Yetki Değiştir">
                         {u.role === 'admin' ? <ArrowDownCircle size={16}/> : <ArrowUpCircle size={16}/>}
                      </button>
                      <button onClick={()=>toggleBan(u._id)} style={{...actionBtnStyle, color: u.isBanned?'#10b981':'#ef4444'}} title={u.isBanned?"Aç":"Banla"}>
                         {u.isBanned?<CheckCircle size={16}/>:<Ban size={16}/>}
                      </button>
                   </div>
                </td>
             </tr>
           ))}
        </tbody>
      </table>
    </div>
  );
}