import React, { useState } from 'react';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // YENİ: Yüklenme durumu
  
  // FORM DATALARI
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (endpoint) => {
    // Validasyonlar
    if (!email || !password) return alert("E-posta ve şifre zorunlu!");
    if (endpoint === 'register') {
      if(!username || !firstName || !lastName) return alert("Tüm alanları doldurun!");
    }

    // Yüklenme başladı (Butonu kilitle ve döndür)
    setIsLoading(true);

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
      } else { 
        alert("❌ Hata: " + (data.error || "Bilinmeyen hata")); 
      }
    } catch (err) { 
      console.error(err);
      alert("⚠️ Sunucuya bağlanılamadı! İnternet bağlantını kontrol et."); 
    } finally {
      // İşlem bitti (Başarılı olsa da olmasa da dönmeyi durdur)
      setIsLoading(false);
    }
  };

  const containerStyle = { width: '100%', height:'100vh', display:'flex', justifyContent:'center', alignItems:'center' };
  const formStyle = { backgroundColor: '#1e293b', padding: '40px', borderRadius: '20px', width: '350px', textAlign: 'center', border: '1px solid #334155' };
  const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: 'white', outline: 'none', width: '100%', marginBottom:'15px' };
  
  // GÜNCELLENEN BUTON STİLİ (Flexbox ve Disabled durumu için)
  const buttonStyle = { 
    padding: '0', // Padding'i sıfırladık, yükseklik ile ayarlayacağız
    height: '45px', // Sabit yükseklik (Dönerken buton boyu değişmesin)
    borderRadius: '8px', 
    border: 'none', 
    backgroundColor: isLoading ? '#6366f1' : '#3b82f6', // Yüklenirken rengi biraz soldur
    color: 'white', 
    fontWeight: 'bold', 
    cursor: isLoading ? 'not-allowed' : 'pointer', // Yüklenirken tıklanamaz imleci
    width: '100%',
    display: 'flex',          // İçeriği ortalamak için
    justifyContent: 'center', // Yatay ortalama
    alignItems: 'center',     // Dikey ortalama
    opacity: isLoading ? 0.8 : 1 // Yüklenirken hafif şeffaf
  };

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2 style={{ color: '#60a5fa', marginBottom: '20px' }}>{isLogin ? 'KULLANICI GİRİŞ' : 'KAYIT OL'}</h2>
        
        {!isLogin && (
          <>
            <input type="text" placeholder="Adın" style={inputStyle} onChange={e => setFirstName(e.target.value)} disabled={isLoading} />
            <input type="text" placeholder="Soyadın" style={inputStyle} onChange={e => setLastName(e.target.value)} disabled={isLoading} />
            <input type="text" placeholder="Kullanıcı Adı" style={inputStyle} onChange={e => setUsername(e.target.value)} disabled={isLoading} />
          </>
        )}

        <input type="email" placeholder="E-posta" style={inputStyle} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
        <input type="password" placeholder="Şifre" style={inputStyle} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
        
        <button 
          style={buttonStyle} 
          onClick={() => handleAuth(isLogin ? 'login' : 'register')}
          disabled={isLoading} // Yüklenirken tıklamayı engelle
        >
          {isLoading ? <div className="loading-spinner"></div> : (isLogin ? 'GİRİŞ YAP' : 'KAYIT OL')}
        </button>
        
        <p onClick={() => !isLoading && setIsLogin(!isLogin)} style={{ color: '#94a3b8', marginTop: '20px', cursor: isLoading ? 'default' : 'pointer' }}>
          {isLogin ? 'Hesabın yok mu? Kayıt Ol' : 'Zaten hesabın var mı? Giriş Yap'}
        </p>
      </div>
    </div>
  );
}