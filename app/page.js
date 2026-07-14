'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { relativeTime } from './utils';
import { useToast, default as Toast } from './toast';
import { useAuth } from './auth';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt-desc');
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/login'); return; }

    fetch('/api/memos', {
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
      .then((res) => {
        if (res.status === 401) { router.push('/login'); return; }
        return res.json();
      })
      .then((data) => {
        if (data) setMemos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, authLoading, router]);

  const filteredMemos = memos.filter((memo) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      memo.title.toLowerCase().includes(q) ||
      memo.content.toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    switch (sortBy) {
      case 'updatedAt-asc':
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      case 'title-asc':
        return a.title.localeCompare(b.title, 'zh-CN');
      case 'title-desc':
        return b.title.localeCompare(a.title, 'zh-CN');
      case 'createdAt-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      default:
        return new Date(b.updatedAt) - new Date(a.updatedAt);
    }
  });

  if (authLoading) return <div className="loading">加载中...</div>;
  if (!user) return null;

  return (
    <div>
      <div className="header">
        <h1>我的备忘录</h1>
        <Link href="/memos/new" className="btn btn-primary">+ 新建</Link>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="搜索备忘录..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {!loading && memos.length > 0 && (
        <div className="toolbar">
          <span className="toolbar-count">{filteredMemos.length} 条</span>
          <div className="toolbar-sort">
            <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="updatedAt-desc">最近更新</option>
              <option value="updatedAt-asc">最早更新</option>
              <option value="createdAt-desc">最新创建</option>
              <option value="title-asc">标题 A-Z</option>
              <option value="title-desc">标题 Z-A</option>
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">加载中...</div>
      ) : memos.length === 0 && !searchQuery ? (
        <div className="empty">
          <p>还没有备忘录</p>
          <p style={{ marginTop: 8, fontSize: 14, color: '#999' }}>点击「+ 新建」创建第一条</p>
        </div>
      ) : filteredMemos.length === 0 ? (
        <div className="empty">
          <p>没有找到匹配的备忘录</p>
          <p style={{ marginTop: 8, fontSize: 14, color: '#999' }}>试试其他关键词</p>
        </div>
      ) : (
        <ul className="memo-list">
          {filteredMemos.map((memo) => (
            <li key={memo.id} className="memo-item">
              <Link href={"/memos/" + memo.id}>
                <h3>{memo.title}</h3>
                <div className="preview">{memo.content}</div>
                <div className="time">{relativeTime(memo.updatedAt)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Toast toast={toast} />
    </div>
  );
}
