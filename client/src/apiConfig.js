// client/src/apiConfig.js

// Eğer site "localhost" üzerinde çalışıyorsa yerel sunucuyu seç,
// Yoksa (yani site internetteyse) canlı sunucuyu seç.
const API_BASE_URL = window.location.hostname === 'localhost'
  ? "http://localhost:5002" 
  : "https://mete-akademi.onrender.com";

export default API_BASE_URL;