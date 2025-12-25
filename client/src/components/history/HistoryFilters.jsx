// client/src/components/history/HistoryFilters.jsx
import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function HistoryFilters({ searchTerm, setSearchTerm, filterType, setFilterType }) {
  const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none', width: '100%' };

  return (
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
  );
}