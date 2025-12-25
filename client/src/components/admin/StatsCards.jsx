// client/src/components/admin/StatsCards.jsx
import React from 'react';
import { User, Crown, Zap, Clock } from 'lucide-react';

export default function StatsCards({ stats }) {
  if (!stats) return null;

  const kpiStyle = (color) => ({ 
    background:'#1e293b', padding:'20px', borderRadius:'16px', 
    borderLeft:`4px solid ${color}`, position:'relative', 
    overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.1)',
    display: 'flex', flexDirection: 'column', justifyContent: 'center' 
  });

  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', marginBottom:'20px'}}>
      <div style={kpiStyle('#3b82f6')}>
        <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:'bold'}}>Toplam Öğrenci</div>
        <div style={{fontSize:'24px', fontWeight:'bold', marginTop:'5px'}}>{stats.totalUsers}</div>
        <User size={24} style={{position:'absolute', right:15, top:20, color:'#3b82f6', opacity:0.2}}/>
      </div>
      
      <div style={kpiStyle('#8b5cf6')}>
        <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:'bold'}}>Yöneticiler</div>
        <div style={{fontSize:'24px', fontWeight:'bold', marginTop:'5px'}}>{stats.totalAdmins || 1}</div>
        <Crown size={24} style={{position:'absolute', right:15, top:20, color:'#8b5cf6', opacity:0.2}}/>
      </div>
      
      <div style={kpiStyle('#10b981')}>
        <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:'bold'}}>Bugün Aktif</div>
        <div style={{fontSize:'24px', fontWeight:'bold', marginTop:'5px'}}>{stats.activeUsersToday}</div>
        <Zap size={24} style={{position:'absolute', right:15, top:20, color:'#10b981', opacity:0.2}}/>
      </div>
      
      <div style={kpiStyle('#f59e0b')}>
        <div style={{fontSize:'12px', color:'#94a3b8', fontWeight:'bold'}}>Toplam Çalışma</div>
        <div style={{fontSize:'24px', fontWeight:'bold', marginTop:'5px'}}>{stats.totalPomodoroHours} sa</div>
        <Clock size={24} style={{position:'absolute', right:15, top:20, color:'#f59e0b', opacity:0.2}}/>
      </div>
    </div>
  );
}