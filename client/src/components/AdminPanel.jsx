import React, { useState, useEffect } from 'react';
import { Shield, User, Ban, Activity, Clock, Zap, CheckCircle, Search, Eye, X, BookOpen, AlertTriangle, BarChart as BarChartIcon, Crown, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminPanel() {
  const [activeView, setActiveView] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Detay Modalı
  const [selectedUser, setSelectedUser] = useState(null);
  const [userLogs, setUserLogs] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const s = await fetch('http://127.0.0.1:5002/api/admin/stats').then(r=>r.json());
      const u = await fetch('http://127.0.0.1:5002/api/admin/users').then(r=>r.json());
      setStats(s); setUsers(u);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const openUserDetail = async (user) => {
    setSelectedUser(user);
    try {
      const res = await fetch(`http://127.0.0.1:5002/api/studylogs?username=${user.username}`);
      if(res.ok) setUserLogs(await res.json());
    } catch (e) {}
  };

  // BANLAMA FONKSİYONU
  const toggleBan = async (userId) => {
    if(!confirm("Kullanıcının erişimini değiştirmek istediğine emin misin?")) return;
    await fetch('http://127.0.0.1:5002/api/admin/toggle-ban', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId})
    });
    fetchData();
  };

  // --- YENİ: YETKİ VERME / ALMA FONKSİYONU ---
  const toggleRole = async (userId) => {
    if(!confirm("Bu kullanıcının Yönetici yetkisini değiştirmek üzeresin. Emin misin?")) return;
    
    const res = await fetch('http://127.0.0.1:5002/api/admin/toggle-role', {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({userId})
    });
    const data = await res.json();
    
    if(!res.ok) alert(data.error); // Eğer Metosor'u değiştirmeye çalışırsa hata ver
    else fetchData();
  };
  // --------------------------------------------

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return <div style={{color:'white', padding:'50px', textAlign:'center'}}>Yükleniyor...</div>;
  if (!stats) return <div style={{color:'#ef4444', padding:'50px', textAlign:'center'}}>Veri alınamadı.</div>;

  return (
    <div style={{width:'100%', color:'white'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px', alignItems:'center'}}>
        <h2 style={{color:'#ef4444', display:'flex', gap:'10px', alignItems:'center', margin:0}}><Shield size={28}/> CEO KOKPİTİ</h2>
        <div style={{display:'flex', background:'#1e293b', padding:'5px', borderRadius:'10px', border:'1px solid #334155'}}>
          <button onClick={()=>setActiveView('dashboard')} style={{...tabStyle(activeView==='dashboard')}}><Activity size={16}/> GENEL BAKIŞ</button>
          <button onClick={()=>setActiveView('users')} style={{...tabStyle(activeView==='users')}}><User size={16}/> ÖĞRENCİLER</button>
        </div>
      </div>

      {activeView === 'dashboard' && (
        <div style={{display:'flex', flexDirection:'column', gap:'20px'}}>
           {/* KPI KARTLARI */}
           <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px'}}>
              <div style={kpiStyle('#3b82f6')}><div className="label">Toplam Öğrenci</div><div className="val">{stats.totalUsers}</div><User className="icon" size={24}/></div>
              <div style={kpiStyle('#8b5cf6')}><div className="label">Yöneticiler</div><div className="val">{stats.totalAdmins || 1}</div><Crown className="icon" size={24}/></div>
              <div style={kpiStyle('#10b981')}><div className="label">Bugün Aktif</div><div className="val">{stats.activeUsersToday}</div><Zap className="icon" size={24}/></div>
              <div style={kpiStyle('#f59e0b')}><div className="label">Toplam Çalışma</div><div className="val">{stats.totalPomodoroHours} sa</div><Clock className="icon" size={24}/></div>
           </div>

           {/* GRAFİKLER */}
           <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', minHeight:'300px'}}>
              <div style={cardStyle}>
                 <h3 style={{marginBottom:'20px', fontSize:'16px', color:'#94a3b8'}}>📉 Saatlik Aktivite</h3>
                 <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={stats.hourlyActivity}>
                       <defs><linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                       <XAxis dataKey="hour" stroke="#64748b" fontSize={12}/>
                       <YAxis stroke="#64748b" fontSize={12}/>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false}/>
                       <Tooltip contentStyle={{backgroundColor:'#0f172a', border:'1px solid #334155', borderRadius:'8px'}}/>
                       <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
              <div style={cardStyle}>
                 <h3 style={{marginBottom:'20px', fontSize:'16px', color:'#94a3b8'}}>🍰 Popüler Dersler</h3>
                 <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                       <Pie data={stats.lessonDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {stats.lessonDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                       </Pie>
                       <Tooltip contentStyle={{backgroundColor:'#0f172a', border:'1px solid #334155', borderRadius:'8px'}}/>
                       <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>
      )}

      {activeView === 'users' && (
        <div style={cardStyle}>
          <div style={{marginBottom:'20px', position:'relative'}}>
             <Search size={18} style={{position:'absolute', top:12, left:10, color:'#94a3b8'}}/>
             <input style={{width:'100%', padding:'10px 10px 10px 35px', background:'#0f172a', border:'1px solid #334155', color:'white', borderRadius:'8px', boxSizing:'border-box'}} placeholder="Öğrenci ara..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)}/>
          </div>
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
                          
                          {/* YETKİ BUTONU (YENİ) */}
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
      )}

      {selectedUser && (
        <div style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.8)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:5000}}>
          <div style={{background:'#1e293b', width:'500px', borderRadius:'20px', border:'1px solid #334155', padding:'25px', position:'relative', boxShadow:'0 20px 50px rgba(0,0,0,0.5)'}}>
            <button onClick={()=>setSelectedUser(null)} style={{position:'absolute', top:20, right:20, background:'none', border:'none', color:'#64748b', cursor:'pointer'}}><X size={20}/></button>
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
      )}
    </div>
  );
}

const tabStyle = (active) => ({ padding:'8px 16px', background: active ? '#ef4444' : 'transparent', color: active ? 'white' : '#94a3b8', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'bold', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px', transition:'0.2s' });
const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'16px', border:'1px solid #334155', height:'100%', boxSizing:'border-box' };
const kpiStyle = (color) => ({ background:'#1e293b', padding:'20px', borderRadius:'16px', borderLeft:`4px solid ${color}`, position:'relative', overflow:'hidden', boxShadow:'0 4px 6px rgba(0,0,0,0.1)' });
const actionBtnStyle = { background:'transparent', border:'1px solid #334155', padding:'8px', borderRadius:'8px', color:'#94a3b8', cursor:'pointer', marginLeft:'5px', transition:'0.2s' };