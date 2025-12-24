import React, { useState, useMemo } from 'react';
import { History as HistoryIcon, Clock, CheckCircle, Search, Filter, Calendar, Zap, BookOpen } from 'lucide-react';

export default function History({ studyLogs }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'pomodoro', 'program'

  // --- İSTATİSTİKLERİ HESAPLA ---
  const stats = useMemo(() => {
    const totalSessions = studyLogs.length;
    const totalMinutes = studyLogs.reduce((acc, log) => acc + (log.duration || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    
    // En çok çalışılan dersi bul
    const lessonCounts = {};
    studyLogs.forEach(log => { lessonCounts[log.lesson] = (lessonCounts[log.lesson] || 0) + 1; });
    const favoriteLesson = Object.keys(lessonCounts).sort((a,b) => lessonCounts[b] - lessonCounts[a])[0] || '-';

    return { totalSessions, totalHours, favoriteLesson };
  }, [studyLogs]);

  // --- FİLTRELEME MANTIĞI ---
  const filteredLogs = studyLogs.filter(log => {
    const matchesSearch = 
      log.lesson.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.topic.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' ? true : log.type === filterType;
    
    return matchesSearch && matchesType;
  });

  // --- RENK VE İKON SEÇİCİ ---
  const getTypeStyles = (type) => {
    if (type === 'pomodoro') return { bg: 'rgba(249, 115, 22, 0.1)', border: '#f97316', icon: <Clock size={16} color='#f97316'/>, label: 'Pomodoro' };
    return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: <CheckCircle size={16} color='#10b981'/>, label: 'Program' };
  };

  // --- STİLLER ---
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '15px', border: '1px solid #334155', padding: '20px', marginBottom: '20px' };
  const statCardStyle = { flex: 1, backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '15px' };
  const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none', width: '100%' };

  return (
    <div style={{ width: '100%', color: 'white' }}>
      
      {/* BAŞLIK VE ÖZET */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#10b981', display: 'flex', gap: '10px' }}>
          <HistoryIcon /> Çalışma Analizi
        </h2>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>Toplam {stats.totalSessions} Kayıt</span>
      </div>

      {/* İSTATİSTİK KARTLARI */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(59, 130, 246, 0.2)' }}><Clock color='#3b82f6' /></div>
          <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Toplam Süre</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalHours} Sa</div></div>
        </div>
        <div style={statCardStyle}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(249, 115, 22, 0.2)' }}><Zap color='#f97316' /></div>
          <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Oturum</div><div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalSessions}</div></div>
        </div>
        <div style={statCardStyle}>
          <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.2)' }}><BookOpen color='#a855f7' /></div>
          <div><div style={{ fontSize: '12px', color: '#94a3b8' }}>Favori Ders</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{stats.favoriteLesson}</div></div>
        </div>
      </div>

      {/* ARAMA VE FİLTRE */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div style={{ flex: 2, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Ders veya konu ara..." 
              style={{ ...inputStyle, paddingLeft: '35px' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <Filter size={16} style={{ position: 'absolute', left: '10px', top: '12px', color: '#94a3b8' }} />
            <select 
              style={{ ...inputStyle, paddingLeft: '35px', cursor:'pointer' }} 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="ALL">Tümü</option>
              <option value="pomodoro">Sadece Pomodoro</option>
              <option value="program">Sadece Program</option>
            </select>
          </div>
        </div>

        {/* LİSTE */}
        <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Kayıt bulunamadı.</div>
          ) : (
            filteredLogs.map((log) => {
              const style = getTypeStyles(log.type);
              return (
                <div key={log._id} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                  backgroundColor: '#0f172a', padding: '15px', borderRadius: '10px', 
                  marginBottom: '10px', borderLeft: `4px solid ${style.border}` 
                }}>
                  {/* SOL: İKON VE DERS BİLGİSİ */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ padding: '8px', borderRadius: '50%', backgroundColor: style.bg }}>
                      {style.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 'bold', fontSize: '14px', color: 'white' }}>{log.lesson}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{log.topic}</div>
                    </div>
                  </div>

                  {/* SAĞ: TARİH VE SÜRE */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'flex-end' }}>
                      <Calendar size={12} /> {log.date}
                    </div>
                    {log.duration > 0 ? (
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#f97316' }}>{log.duration} dk</div>
                    ) : (
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px', marginTop:'2px' }}>TAMAMLANDI</div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}