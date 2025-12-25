// client/src/components/admin/AdminCharts.jsx
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function AdminCharts({ stats }) {
  if (!stats) return null;
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const cardStyle = { background:'#1e293b', padding:'20px', borderRadius:'16px', border:'1px solid #334155', height:'100%', boxSizing:'border-box' };

  return (
    <div style={{display:'grid', gridTemplateColumns:'2fr 1fr', gap:'20px', minHeight:'300px'}}>
      {/* Çizgi Grafik */}
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

      {/* Pasta Grafik */}
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
  );
}