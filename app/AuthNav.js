'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from './auth';

export default function AuthNav() {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) return null;

  return (
    <nav className='nav-bar'>
      <div className='container'>
        <Link href='/' style={{ textDecoration: 'none', color: '#333', fontWeight: 600, fontSize: 16 }}>
          个人备忘录
        </Link>
        {user && (
          <div className='nav-right'>
            <span className='nav-user'>{user.username}</span>
            <button className='btn btn-secondary btn-sm' onClick={logout}>退出</button>
          </div>
        )}
      </div>
    </nav>
  );
}
