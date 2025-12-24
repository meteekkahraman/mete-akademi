import React, { useState, useEffect } from 'react';
import { Zap, Activity } from 'lucide-react';

export default function AutoWall() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5002/api/posts');
        setPosts(await res.json());
      } catch(e) {}
    };
    fetchPosts();
    const interval = setInterval(fetchPosts, 10000); // 10 sn'de bir yenile
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{maxWidth:'700px', margin:'0 auto'}}>
      <div style={{textAlign:'center', marginBottom:'20px', color:'#94a3b8', fontSize:'14px'}}>
        <Zap size={14} style={{display:'inline', marginBottom:'-2px'}}/> Bu alan sadece başarıları gösterir. Boş konuşmak yok!
      </div>

      {posts.map((post, i) => (
        <div key={i} 
             style={{
               backgroundColor: post.isSystem ? '#0f172a' : '#1e293b', // Sistem mesajı daha koyu
               padding: '20px', borderRadius: '15px', border: post.isSystem ? '1px solid #8b5cf6' : '1px solid #334155', 
               marginBottom: '15px', display:'flex', gap:'15px', alignItems:'center'
             }}>
          
          {/* AVATAR */}
          <div style={{
            minWidth:'40px', height:'40px', borderRadius:'50%', 
            backgroundColor: post.isSystem ? '#8b5cf6' : '#3b82f6', 
            display:'flex', justifyContent:'center', alignItems:'center', fontWeight:'bold', color:'white'
          }}>
            {post.isSystem ? <Activity size={20}/> : post.username.charAt(0).toUpperCase()}
          </div>

          <div style={{flex:1}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
               <span style={{fontWeight:'bold', color: post.isSystem ? '#a78bfa' : '#60a5fa'}}>
                 {post.username} {post.isSystem && <span style={{fontSize:'10px', background:'#8b5cf6', color:'white', padding:'2px 5px', borderRadius:'4px', marginLeft:'5px'}}>SİSTEM</span>}
               </span>
               <span style={{fontSize:'12px', color:'#64748b'}}>{new Date(post.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <p style={{color:'white', lineHeight:'1.4'}}>{post.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}