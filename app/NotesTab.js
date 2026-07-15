'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast, default as Toast } from './toast';

export default function NotesTab({ user }) {
  const router = useRouter();
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (!user) return;
    fetch('/api/memos', {
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
      .then(res => { if (res.status === 401) return; return res.json(); })
      .then(data => { if (data) setMemos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user) return <div className="empty"><p>请先登录</p></div>;

  return (
    <div>
      <div className="header">
        <h1>我的便签</h1>
        <Link href="/memos/new" className="btn btn-primary">+ 新建</Link>
      </div>
      {loading ? (
        <div className="loading">加载中...</div>
      ) : memos.length === 0 ? (
        <div className="empty">
          <p>还没有便签</p>
          <p style={{ marginTop: 8, fontSize: 14, color: '#999' }}>点击「+ 新建」创建第一条</p>
        </div>
      ) : (
        <ul className="memo-list">
          {memos.map(memo => (
            <li key={memo.id} className="memo-item">
              <Link href={'/memos/' + memo.id}>
                <h3>{memo.title}</h3>
                <div className="preview">{memo.content}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Toast toast={toast} />
    </div>
  );
}
