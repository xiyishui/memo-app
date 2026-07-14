'use client';

import Link from 'next/link';
import { useAuth } from './auth';

export default function AuthNav() {
  const { user, loading, logout } = useAuth();

  if (loading) return null;

  return (
    <nav className="nav-bar">
      <div className="container">
        <Link href={user ? '/' : '/login'}>📝 个人备忘录</Link>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">{user.username}</span>
              <button className="btn btn-secondary btn-sm" onClick={logout}>退出</button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">登录</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
