'use client';

import { useState } from 'react';
import { useAuth } from './auth';

export default function ProfileTab({ user }) {
  const { logout } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar">{user.username[0]?.toUpperCase()}</div>
          <h2>{user.username}</h2>
          <p className="profile-id">ID: {user.id}</p>
          <button className="btn btn-danger profile-btn" onClick={logout}>退出登录</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '失败');
      login(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="auth-card">
        <h1>{isRegister ? '注册' : '登录'}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="至少2位字符" />
          </div>
          <div className="form-group">
            <label>密码</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="至少6位字符" />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? '处理中...' : (isRegister ? '注册' : '登录')}
          </button>
        </form>
        <p className="auth-link" style={{ cursor: 'pointer' }} onClick={() => { setError(''); setIsRegister(!isRegister); }}>
          {isRegister ? '已有账号？点击登录' : '没有账号？点击注册'}
        </p>
      </div>
    </div>
  );
}
