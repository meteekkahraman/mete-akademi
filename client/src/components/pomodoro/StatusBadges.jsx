import React from 'react';
import { BadgeCheck, AlertTriangle } from 'lucide-react';

export default function StatusBadges({ isTop3, isLimitReached }) {
  if (!isTop3 && !isLimitReached) return null;

  return (
    <div style={{ width: '100%', marginBottom: '20px' }}>
      {/* Haftanın Yıldızı Rozeti */}
      {isTop3 && (
        <div style={{marginBottom:'10px', display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', color:'#3b82f6', background:'rgba(59, 130, 246, 0.1)', padding:'10px', borderRadius:'10px', fontWeight:'bold', fontSize:'14px', border:'1px solid rgba(59, 130, 246, 0.2)'}}>
          <BadgeCheck size={20} fill="#3b82f6" color="#1e293b"/> HAFTANIN YILDIZI
        </div>
      )}

      {/* Limit Uyarısı */}
      {isLimitReached && (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center', gap:'8px', color:'#ef4444', background:'rgba(239, 68, 68, 0.1)', padding:'10px', borderRadius:'10px', fontWeight:'bold', fontSize:'14px', border:'1px solid rgba(239, 68, 68, 0.2)'}}>
          <AlertTriangle size={20} /> GÜNLÜK LİMİT DOLDU (14 SAAT)
        </div>
      )}
    </div>
  );
}