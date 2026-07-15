'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './auth';

export default function ProfileTab({ user }) {
  const { logout, login } = useAuth();
  const [page, setPage] = useState('profile');
  const [trash, setTrash] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isReg, setReg] = useState(false);
  const [un, setUn] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

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
      if (!r.ok) throw new Error(d.error || '\u5931\u8d25');
      login(d);
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  if (!user) {
    return (
      <div className='profile-page'>
        <div className='auth-card'>
          <h1>{isReg ? '\u6ce8\u518c' : '\u767b\u5f55'}</h1>
          <form onSubmit={handleLogin}>
            <div className='form-group'><label>\u7528\u6237\u540d</label><input type='text' value={un} onChange={e => setUn(e.target.value)} placeholder='\u81f3\u5c112\u4f4d\u5b57\u7b26' /></div>
            <div className='form-group'><label>\u5bc6\u7801</label><input type='password' value={pw} onChange={e => setPw(e.target.value)} placeholder='\u81f3\u5c116\u4f4d\u5b57\u7b26' /></div>
            {err && <p className='error-msg'>{err}</p>}
            <button type='submit' className='btn btn-primary auth-btn' disabled={busy}>{busy ? '\u5904\u7406\u4e2d...' : (isReg ? '\u6ce8\u518c' : '\u767b\u5f55')}</button>
          </form>
          <p className='auth-link' style={{ cursor: 'pointer' }} onClick={() => { setErr(''); setReg(!isReg); }}>
            {isReg ? '\u5df2\u6709\u8d26\u53f7\uff1f\u70b9\u51fb\u767b\u5f55' : '\u6ca1\u6709\u8d26\u53f7\uff1f\u70b9\u51fb\u6ce8\u518c'}
          </p>
        </div>
      </div>
    );
  }

  if (page === 'trash') {
    return (
      <div>
        <div className='header'><button className='btn btn-secondary' onClick={() => setPage('profile')}>{'\u2190'} \u8fd4\u56de</button><h1>\u56de\u6536\u7ad9</h1></div>
        {loading ? <div className='loading'>\u52a0\u8f7d\u4e2d...</div> :
         trash.length === 0 ? <div className='empty'><p>\u56de\u6536\u7ad9\u662f\u7a7a\u7684</p></div> :
         <ul className='memo-list'>{trash.map(t =>
           <li key={t.id} className='memo-item' style={{ opacity: 0.6 }}>
             <h3>{t.title}</h3>
             <button className='btn btn-secondary btn-sm' onClick={() => restoreItem(t.id)}>\u8fd8\u539f</button>
           </li>
         )}</ul>}
      </div>
    );
  }

  if (page === 'recent') {
    return (
      <div>
        <div className='header'><button className='btn btn-secondary' onClick={() => setPage('profile')}>{'\u2190'} \u8fd4\u56de</button><h1>\u6700\u8fd1\u67e5\u770b</h1></div>
        {loading ? <div className='loading'>\u52a0\u8f7d\u4e2d...</div> :
         recent.length === 0 ? <div className='empty'><p>\u8fd8\u6ca1\u6709\u67e5\u770b\u8fc7\u4fbf\u7b7e</p></div> :
         <ul className='memo-list'>{recent.map(r =>
           <li key={r.memoId} className='memo-item'>
             <Link href={'/memos/' + r.memoId} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
               <h3>{r.title || '\u65e0\u6807\u9898'}</h3>
             </Link>
           </li>
         )}</ul>}
      </div>
    );
  }

  return (
    <div className='profile-page'>
      <div className='profile-card'>
        <div className='profile-avatar'>{user.username[0]?.toUpperCase()}</div>
        <h2>{user.username}</h2>
        <div className='profile-menu'>
          <button className='profile-menu-item' onClick={loadRecent}>\u6700\u8fd1\u67e5\u770b</button>
          <button className='profile-menu-item' onClick={loadTrash}>\u56de\u6536\u7ad9</button>
          <button className='profile-menu-item logout' onClick={logout}>\u9000\u51fa\u767b\u5f55</button>
        </div>
      </div>
    </div>
  );
}
