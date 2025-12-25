import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  
  // FORM DATALARI
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (endpoint) => {
    if (!email || !password) return alert("E-posta ve şifre zorunlu!");
    if (endpoint === 'register') {
      if(!username || !firstName || !lastName) return alert("Tüm alanları doldurun!");
    }

    try {
      const bodyData = endpoint === 'register' ? { username, firstName, lastName, email, password } : { email, password };
      
      // Render adresine istek atıyoruz
      const res = await fetch(`https://mete-akademi.onrender.com/api/${endpoint}`, { 
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) 
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (endpoint === 'register') { 
          alert("✅ Kayıt Başarılı! Giriş yapabilirsin."); 
          setIsLogin(true); 
        } else { 
          // Başarılı girişi App.jsx'e bildir
          onLoginSuccess(data.username, data.role);
        }
      } else { alert("❌ Hata: " + (data.error || "Bilinmeyen hata")); }
    } catch (err) { 
      // HATA MESAJI DÜZELTİLDİ: Artık Port 5002 yazmayacak
      console.error(err);
      alert("⚠️ Sunucuya bağlanılamadı! İnternet bağlantını kontrol et."); 
    }
  };

  const containerStyle = { width: '100%', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center' };
  const formStyle = { backgroundColor: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', textAlign: 'center', border: '1px solid #334155' };
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none', width: '100%', marginBottom:'15px' };
  const buttonStyle = { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 'bold', cursor: 'pointer', width: '100%' };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>{isLogin ? 'KULLANICI GİRİŞ' : 'KAYIT OL'}</h2>
        
        {!isLogin && (
          <>
            <input type="text" placeholder="Adın" style={inputStyle} onChange={e => setFirstName(e.target.value)} />
            <input type="text" placeholder="Soyadın" style={inputStyle} onChange={e => setLastName(e.target.value)} />
            <input type="text" placeholder="Kullanıcı Adı" style={inputStyle} onChange={e => setUsername(e.target.value)} />
          </>
        )}

        <input type="email" placeholder="E-posta" style={inputStyle} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Şifre" style={inputStyle} onChange={e => setPassword(e.target.value)} />
        
        <button style={buttonStyle} onClick={() => handleAuth(isLogin ? 'login' : 'register')}>{isLogin ? 'GİRİŞ YAP' : 'KAYIT OL'}</button>
        
        <p onClick={() => setIsLogin(!isLogin)} style={{ color: '#94a3b8', marginTop: '20px', cursor: 'pointer' }}>
          {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
        </p>
      </div>
    </div>
  );
}