// client/src/components/admin/UserDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';

export default function UserDetailModal({ selectedUser, userLogs, onClose }) {
  if (!selectedUser) return null;

  return (
    <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:5000}}>
      <div style={{background:'#1e293b', width:'500px', borderRadius:'20px', border:'1px solid #334155', padding:'25px', position:'relative', boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
        <button onClick={onClose} style={{position:'absolute', top:20, right:20, background:'none', border:'none', color:'#64748b', cursor:'pointer'}}><X size={20}/></button>
        <h3 style={{marginBottom:'20px', color:'#3b82f6'}}>@{selectedUser.username} Dosyası</h3>
        <div style={{maxHeight:'300px', overflowY:'auto'}}>
           {userLogs.length === 0 ? <p style={{color:'#64748b'}}>Kayıt yok.</p> : userLogs.map((log, i) => (
             <div key={i} style={{padding:'10px', borderBottom:'1px solid #334155', fontSize:'13px', display:'flex', justifyContent:'space-between'}}>
                <span>{log.lesson} - {log.topic}</span>
                <span style={{color:'#10b981', fontWeight:'bold'}}>{log.duration} dk</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}