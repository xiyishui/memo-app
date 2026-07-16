'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from './auth';

export default function NotesTab({ user }) {
  const [memos, setMemos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const load = () => {
    if (!user) return;
    fetch('/api/memos', { headers: { 'Authorization': 'Bearer ' + user.token } })
      .then(r => r.json())
      .then(d => { if (d) setMemos(d); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [user]);

  const togglePin = async (memo) => {
    await fetch('/api/memos/' + memo.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({ pinned: !memo.pinned })
    });
    load();
  };

  if (!user) return <div className='empty'><p>请先登录</p></div>;

  // Collect all unique tags
  var allTags = [];
  memos.forEach(function(m) {
    if (m.tags && m.tags.length > 0) {
      m.tags.forEach(function(t) {
        if (allTags.indexOf(t) < 0) allTags.push(t);
      });
    }
  });

  // Search + tag filter
  var filtered = memos.filter(function(m) {
    if (filterTag && (!m.tags || m.tags.indexOf(filterTag) < 0)) return false;
    if (searchQuery && m.title.indexOf(searchQuery) < 0 && m.content.indexOf(searchQuery) < 0) return false;
    return true;
  });

  return (
    <div>
      <div className='header'>
        <h1>我的便签</h1>
        <Link href='/memos/new' className='btn btn-primary'>+ 新建</Link>
      </div>

      <div className='search-bar'>
        <input type='text' className='search-input' placeholder='搜索便签...'
          value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {allTags.length > 0 && (
        <div className='tags-bar'>
          <span className={'tag-chip' + (!filterTag ? ' active' : '')} onClick={() => setFilterTag('')}>全部</span>
          {allTags.map(t => (
            <span key={t} className={'tag-chip' + (filterTag === t ? ' active' : '')} onClick={() => setFilterTag(t)}>{t}</span>
          ))}
        </div>
      )}

      {loading ? (
        <div className='loading'>加载中...</div>
      ) : filtered.length === 0 ? (
        <div className='empty'>
          <p>{searchQuery || filterTag ? '没有找到匹配的便签' : '还没有便签'}</p>
          {!searchQuery && !filterTag && <p style={{ marginTop: 8, fontSize: 14, color: '#999' }}>点击「+ 新建」创建第一条</p>}
        </div>
      ) : (
        <ul className='memo-list'>
          {filtered.filter(m => m && m.id).map(memo => (
            <li key={memo.id} className={'memo-item' + (memo.pinned ? ' pinned' : '')}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span className='pin-btn' onClick={() => togglePin(memo)} style={{ cursor: 'pointer', fontSize: 16, marginTop: 2, flexShrink: 0 }}>
                  {memo.pinned ? '📌' : '📍'}
                </span>
                <Link href={'/memos/' + memo.id} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                  <h3>{memo.title}</h3>
                  <div className='preview'>{memo.content}</div>
                  <div className='time'>
                    {(memo.tags || []).map(t => <span key={t} className='tag-mini'>{t}</span>)}
                  </div>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
