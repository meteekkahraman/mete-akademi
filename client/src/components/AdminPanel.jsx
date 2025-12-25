// client/src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { Shield, Activity, User } from 'lucide-react';

// Alt Bileşenler ('admin' klasöründen)
// Eğer bu dosyaları 'admin' klasörüne taşımadıysan hata alırsın, dikkat et!
import StatsCards from './admin/StatsCards';
import AdminCharts from './admin/AdminCharts';
import UserTable from './admin/UserTable';
import UserDetailModal from './admin/UserDetailModal';

export default function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. DÜZELTME: Linkleri 'localhost:5001' yaptık
      const s = await fetch('http://localhost:5001/api/admin/stats').then(r=>r.json());
      const u = await fetch('http://localhost:5001/api/admin/users').then(r=>r.json());
      
      // 2. DÜZELTME: Veri boş gelirse çökmemesi için kontrol ekledik
      if (s && u) {
        setStats(s); 
        setUsers(u);
      }
    } catch(e) { 
      console.error("Admin veri hatası:", e); 
    }
    setLoading(false);
  };

  const openUserDetail = async (user) => {
    setSelectedUser(user);
    try {
      // Link Düzeltmesi
      const res = await fetch(`http://localhost:5001/api/studylogs?username=${user.username}`);
      if(res.ok) setUserLogs(await res.json());
    } catch (e) {}
  };

  const toggleBan = async (userId) => {
    if(!confirm("Erişim durumu değişsin mi?")) return;
    // Link Düzeltmesi
    await fetch('http://localhost:5001/api/admin/toggle-ban', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId}) });
    fetchData();
  };

  const toggleRole = async (userId) => {
    if(!confirm("Yönetici yetkisi değişsin mi?")) return;
    // Link Düzeltmesi
    const res = await fetch('http://localhost:5001/api/admin/toggle-role', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId}) });
    const data = await res.json();
    if(!res.ok) alert(data.error); else fetchData();
  };

  if (loading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Yükleniyor...</div>;
  
  // Eğer sunucu kapalıysa veya veri gelmezse Beyaz Ekran yerine bu uyarıyı gösterecek
  if (!stats) return (
    <div style={{color:'#ef4444', padding:'50px', textAlign:'center', border:'1px dashed #ef4444', margin:'20px', borderRadius:'10px'}}>
      <h3>⚠️ Veri Alınamadı</h3>
      <p>Lütfen 'server' klasöründe 'node server.js' komutunun çalıştığından emin ol.</p>
    </div>
  );

  return (
    <div style={{width:'100%', color:'white'}}>
      {/* Üst Başlık ve Tablar */}
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{color:'#ef4444', display:'flex', gap:'10px', alignItems:'center', margin:0}}><Shield size={28}/> CEO KOKPİTİ</h2>
        <div style={{display:'flex', background:'#1e293b', padding:'5px', borderRadius:'10px', border:'1px solid #334155'}}>
          <button onClick={()=>setActiveView('dashboard')} style={{...tabStyle(activeView==='dashboard')}}><Activity size={16}/> GENEL BAKIŞ</button>
          <button onClick={()=>setActiveView('users')} style={{...tabStyle(activeView==='users')}}><User size={16}/> ÖĞRENCİLER</button>
        </div>
      </div>

      {/* İÇERİK ALANI */}
      {activeView === 'dashboard' && (
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
           {/* stats verisi varsa göster */}
           {stats && <StatsCards stats={stats} />}
           {stats && <AdminCharts stats={stats} />}
        </div>
      )}

      {activeView === 'users' && (
        <UserTable 
          users={users} 
          toggleBan={toggleBan} 
          toggleRole={toggleRole} 
          openUserDetail={openUserDetail} 
        />
      )}

      {/* DETAY MODALI */}
      <UserDetailModal 
        selectedUser={selectedUser} 
        userLogs={userLogs} 
        onClose={()=>setSelectedUser(null)} 
      />
    </div>
  );
}

const tabStyle = (active) => ({ padding:'8px 16px', background: active ? '#ef4444' : 'transparent', color: active ? 'white' : '#94a3b8', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px', transition:'0.2s' });