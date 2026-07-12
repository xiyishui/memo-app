'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MemoDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/memos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setMemo(data);
          setTitle(data.title);
          setContent(data.content);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('加载失败');
        setLoading(false);
      });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/memos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '更新失败');
      }

      const updated = await res.json();
      setMemo(updated);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这条备忘录吗？')) return;

    try {
      const res = await fetch(`/api/memos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('删除失败');
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (iso) => {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) return <div className="loading">加载中...</div>;
  if (error && !memo) return <div className="empty"><p>{error}</p></div>;
  if (!memo) return <div className="empty"><p>备忘录不存在</p></div>;

  if (editing) {
    return (
      <div>
        <div className="header">
          <h1>编辑备忘录</h1>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>标题</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="form-group">
            <label>内容</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          {error && <p className="error-msg">{error}</p>}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
              取消
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <h1>{memo.title}</h1>
      </div>
      <div className="memo-detail">
        <div className="meta">
          创建于 {formatTime(memo.createdAt)} &middot; 更新于 {formatTime(memo.updatedAt)}
        </div>
        <div className="content">{memo.content}</div>
        <div className="actions">
          <button className="btn btn-primary" onClick={() => setEditing(true)}>编辑</button>
          <button className="btn btn-danger" onClick={handleDelete}>删除</button>
          <button className="btn btn-secondary" onClick={() => router.back()}>返回</button>
        </div>
        {error && <p className="error-msg" style={{ marginTop: 12 }}>{error}</p>}
      </div>
    </div>
  );
}
