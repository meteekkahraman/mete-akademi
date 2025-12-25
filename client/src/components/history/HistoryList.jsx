// client/src/components/history/HistoryList.jsx
import React from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export default function HistoryList({ filteredLogs }) {
  
  // Renk ve İkon Seçici
  const getTypeStyles = (type) => {
    if (type === 'pomodoro') return { bg: 'rgba(249, 115, 22, 0.1)', border: '#f97316', icon: <Clock size={16} color='#f97316'/>, label: 'Pomodoro' };
    return { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: <CheckCircle size={16} color='#10b981'/>, label: 'Program' };
  };

  return (
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
  );
}