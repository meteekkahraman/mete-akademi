import React, { useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import TopicHeatmap from './components/TopicHeatmap'; // Dosyayı import ettik

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [userRole, setUserRole] = useState("student");
  
  // Ekran geçişini yönetmek için yeni bir durum (state) ekledik
  // 'dashboard' veya 'heatmap' değerini alacak
  const [currentView, setCurrentView] = useState("dashboard");

  const handleLoginSuccess = (username, role) => {
    setCurrentUser(username);
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser("");
    setCurrentView("dashboard"); // Çıkış yapınca varsayılan ekrana dön
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {isLoggedIn ? (
        <>
          {/* --- ÜST MENÜ (NAVBAR) --- */}
          {/* Dashboard.jsx'e dokunmadığımız için geçişi buradan yönetiyoruz */}
          <nav style={{ 
            backgroundColor: '#1e293b', 
            padding: '10px 20px', 
            borderBottom: '1px solid #334155',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setCurrentView("dashboard")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: currentView === 'dashboard' ? '#3b82f6' : 'transparent',
                  color: 'white',
                  border: currentView === 'dashboard' ? 'none' : '1px solid #475569',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🏠 Ana Panel
              </button>
              <button 
                onClick={() => setCurrentView("heatmap")}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: currentView === 'heatmap' ? '#3b82f6' : 'transparent',
                  color: 'white',
                  border: currentView === 'heatmap' ? 'none' : '1px solid #475569',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🗺️ Konu Haritası
              </button>
            </div>
            
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Kullanıcı: <span style={{ color: 'white' }}>{currentUser}</span>
            </div>
          </nav>

          {/* --- İÇERİK ALANI --- */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {currentView === 'dashboard' ? (
              <Dashboard 
                currentUser={currentUser} 
                userRole={userRole} 
                onLogout={handleLogout} 
              />
            ) : (
              <TopicHeatmap currentUser={currentUser} />
            )}
          </div>
        </>
      ) : (
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;