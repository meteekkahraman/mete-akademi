// src/components/dashboard/DashboardHeader.jsx
import React from 'react';
import { LayoutDashboard, PieChart, Target, Timer, Globe, History as HistoryIcon, Shield, LogOut, Award, Zap } from 'lucide-react';

export default function DashboardHeader({ currentUser, xp, title, activeTab, setActiveTab, handleSafeLogout, userRole }) {
  
  const headerStyle = { width:'100%', borderBottom:'1px solid #334155', display:'flex', justifyContent:'center', background:'#1e293b', padding:'0 20px', boxSizing: 'border-box' };
  const headerInnerStyle = { width:'100%', maxWidth:'1200px', padding:'15px 0', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap: 'wrap', gap: '15px' };
  const tabStyle = (active) => ({ padding: '8px 12px', borderRadius: '8px', border: 'none', color: active ? 'white' : '#94a3b8', background: active ? '#3b82f6' : 'transparent', cursor: 'pointer', display:'flex', alignItems:'center', gap:'5px', fontSize:'14px', transition:'0.2s', whiteSpace: 'nowrap' });

  return (
    <div style={headerStyle}>
      <div style={headerInnerStyle}>
        <div>
           <h1 style={{ fontSize:'1.5rem', fontWeight:'bold', margin:0, background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>METE KAHRAMAN AKADEMI</h1>
           <div style={{ fontSize:'12px', color:'#94a3b8', display:'flex', gap:'10px', marginTop:'2px' }}><span><Award size={12}/> {title}</span> <span><Zap size={12}/> {xp} XP</span></div>
        </div>
        
        <div style={{ display:'flex', gap:'5px', overflowX: 'auto', paddingBottom:'5px', maxWidth: '100%', scrollbarWidth: 'none' }}>
          <button onClick={()=>setActiveTab('dashboard')} style={tabStyle(activeTab==='dashboard')}><LayoutDashboard size={18}/> Panel</button>
          <button onClick={()=>setActiveTab('subject')} style={tabStyle(activeTab==='subject')}><PieChart size={18}/> Konular</button>
          <button onClick={()=>setActiveTab('questions')} style={tabStyle(activeTab==='questions')}><Target size={18}/> Sorular</button>
          <button onClick={()=>setActiveTab('pomodoro')} style={tabStyle(activeTab==='pomodoro')}><Timer size={18}/> Pomodoro</button>
          <button onClick={()=>setActiveTab('medya')} style={tabStyle(activeTab==='medya')}><Globe size={18}/> Medya</button>
          <button onClick={()=>setActiveTab('history')} style={tabStyle(activeTab==='history')}><HistoryIcon size={18}/> Geçmiş</button>
          {userRole === 'admin' && <button onClick={()=>setActiveTab('admin')} style={tabStyle(activeTab==='admin')}><Shield size={18}/> Yönetim</button>}
          <button onClick={handleSafeLogout} style={{...tabStyle(false), background:'#ef4444', color:'white', marginLeft:'auto'}}><LogOut size={18}/></button>
        </div>
      </div>
    </div>
  );
}