'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from './auth';

export default function ProfileTab({ user }) {
  const { logout } = useAuth();
  const [page, setPage] = useState('profile');
  const [trash, setTrash] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState('');
  const [isReg, setReg] = useState(false);
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const { login } = useAuth();

  useEffect(() => {
    if (user) {
      var saved = ''; try { saved = localStorage.getItem('avatar_' + user.id) || ''; } catch(e) {}
      setAvatar(saved);
    }
  }, [user]);

  const handleAvatar = (e) => {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(ev) {
      var data = ev.target.result;
      setAvatar(data);
      try { localStorage.setItem('avatar_' + user.id, data); } catch(e) {}
    };
    reader.readAsDataURL(file);
  };

  const loadTrash = async () => {
    if (!user) return;
    setLoading(true); setPage('trash');
    const r = await fetch('/api/trash', { headers: { 'Authorization': 'Bearer ' + user.token } });
    if (r.ok) setTrash(await r.json());
    setLoading(false);
  };

  const loadRecent = async () => {
    if (!user) return;
    setLoading(true); setPage('recent');
    const r = await fetch('/api/recent', { headers: { 'Authorization': 'Bearer ' + user.token } });
    if (r.ok) setRecent(await r.json());
    setLoading(false);
  };

  const restoreItem = async (id) => {
    await fetch('/api/trash/' + id + '/restore', { method: 'POST', headers: { 'Authorization': 'Bearer ' + user.token } });
    setTrash(trash.filter(t => t.id !== id));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setErr(''); setBusy(true);
    try {
      const ep = isReg ? '/api/auth/register' : '/api/auth/login';
      const r = await fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: un.trim(), password: pw }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || '失败');
      login(d);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  // Login form when not logged in
  if (!user) {
    return (
      <div className='fullscreen-center'>
        <div className='auth-card'>
          <h1>{isReg ? '注册' : '登录'}</h1>
          <form onSubmit={handleLogin}>
            <div className='form-group'><label>用户名</label><input type='text' value={un} onChange={e => setUn(e.target.value)} placeholder='至少2位字符' /></div>
            <div className='form-group'><label>密码</label><input type='password' value={pw} onChange={e => setPw(e.target.value)} placeholder='至少6位字符' /></div>
            {err && <p className='error-msg'>{err}</p>}
            <button type='submit' className='btn btn-primary auth-btn' disabled={busy}>{busy ? '处理中...' : (isReg ? '注册' : '登录')}</button>
          </form>
          <p className='auth-link' style={{ cursor: 'pointer' }} onClick={() => { setErr(''); setReg(!isReg); }}>
            {isReg ? '已有账号？点击登录' : '没有账号？点击注册'}
          </p>
        </div>
      </div>
    );
  }

  // Trash view
  if (page === 'trash') {
    return (
      <div>
        <div className='header'><button className='btn btn-secondary' onClick={() => setPage('profile')}>{'←'} 返回</button><h1>回收站</h1></div>
        {loading ? <div className='loading'>加载中...</div> :
         trash.length === 0 ? <div className='empty'><p>回收站是空的</p></div> :
         <ul className='memo-list'>{trash.map(t =>
           <li key={t.id} className='memo-item' style={{ opacity: 0.6 }}>
             <h3>{t.title}</h3>
             <button className='btn btn-secondary btn-sm' onClick={() => restoreItem(t.id)}>还原</button>
           </li>
         )}</ul>}
      </div>
    );
  }

  // Recent view
  if (page === 'recent') {
    return (
      <div>
        <div className='header'><button className='btn btn-secondary' onClick={() => setPage('profile')}>{'←'} 返回</button><h1>最近查看</h1></div>
        {loading ? <div className='loading'>加载中...</div> :
         recent.length === 0 ? <div className='empty'><p>还没有查看过便签</p></div> :
         <ul className='memo-list'>{recent.map(r =>
           <li key={r.memoId} className='memo-item'>
             <Link href={'/memos/' + r.memoId} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
               <h3>{r.title || '无标题'}</h3>
             </Link>
           </li>
         )}</ul>}
      </div>
    );
  }

  // Profile view
  return (
    <div className='profile-page'>
      <div className='profile-card'>
        <div className='profile-avatar-wrap' onClick={() => fileRef.current && fileRef.current.click()}>
          {avatar ? <img src={avatar} className='avatar-img' alt='avatar' /> : <div className='profile-avatar'>{user.username[0]?.toUpperCase()}</div>}
          <div className='camera-overlay'>{'\u{1F4F7}'}</div>
        </div>
        <input ref={fileRef} type='file' accept='image/*' style={{ display: 'none' }} onChange={handleAvatar} />
        <h2>{user.username}</h2>
        <div className='profile-divider' />
        <div className='profile-menu'>
          <button className='profile-menu-item' onClick={loadRecent}><span className='icon'>{'\u{1F4CB}'}</span> 最近查看</button>
          <button className='profile-menu-item' onClick={loadTrash}><span className='icon'>{'\u{1F5D1}'}</span> 回收站</button>
          <button className='profile-menu-item logout' onClick={logout}><span className='icon'>{'\u{1F6AA}'}</span> 退出登录</button>
        </div>
      </div>
    </div>
  );
}
