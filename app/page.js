'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/memos')
      .then((res) => res.json())
      .then((data) => {
        setMemos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div>
      <div className="header">
        <h1>我的备忘录</h1>
        <Link href="/memos/new" className="btn btn-primary">+ 新建</Link>
      </div>

      {loading ? (
        <div className="loading">加载中...</div>
      ) : memos.length === 0 ? (
        <div className="empty">
          <p>还没有备忘录</p>
          <p style={{ marginTop: 8, fontSize: 14, color: '#999' }}>点击「+ 新建」创建第一条</p>
        </div>
      ) : (
        <ul className="memo-list">
          {memos.map((memo) => (
            <li key={memo.id} className="memo-item">
              <Link href={`/memos/${memo.id}`}>
                <h3>{memo.title}</h3>
                <div className="preview">{memo.content}</div>
                <div className="time">{formatTime(memo.updatedAt)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
