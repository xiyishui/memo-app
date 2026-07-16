'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../auth';

export default function MemoDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const router = useRouter();
  const [memo, setMemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const hdrs = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (user ? user.token : '') });

  useEffect(() => {
    if (!user) return;
    fetch('/api/memos/' + id, { headers: { 'Authorization': 'Bearer ' + user.token } })
      .then(r => r.json())
      .then(d => {
        if (d.error) { setError(d.error); } else {
          setMemo(d); setTitle(d.title); setContent(d.content); setTags((d.tags || []).join(', '));
          fetch('/api/recent', { method: 'POST', headers: hdrs(), body: JSON.stringify({ memoid: Number(id), title: d.title }) });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user]);

  const handleUpdate = async () => {
    setError('');
    if (!title.trim() || !content.trim()) { setError('标题和内容不能为空'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/memos/' + id, {
        method: 'PUT', headers: hdrs(),
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean) })
      });
      if (!r.ok) throw new Error((await r.json()).error || '失败');
      const u = await r.json(); setMemo(u); setEditing(false);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm('确定删除？将移入回收站')) return;
    await fetch('/api/memos/' + id, { method: 'DELETE', headers: { 'Authorization': 'Bearer ' + user.token } });
    router.push('/');
  };

  if (!user) return null;
  if (loading) return <div className='loading'>加载中...</div>;
  if (error && !memo) return <div className='empty'><p>{error}</p></div>;
  if (!memo) return <div className='empty'><p>不存在</p></div>;

  if (editing) {
    return (
      <div>
        <div className='header'><button className='btn btn-secondary' onClick={() => setEditing(false)}>{'\u2190'}返回</button><h1>编辑</h1></div>
        <div className='form-group'><label>标题</label><input type='text' value={title} onChange={e => setTitle(e.target.value)} /></div>
        <div className='form-group'><label>内容</label><textarea value={content} onChange={e => setContent(e.target.value)} /></div>
        <div className='form-group'><label>标签（逗号分隔）</label><input type='text' value={tags} onChange={e => setTags(e.target.value)} placeholder='工作, 学习' /></div>
        <p style={{ fontSize: 12, color: '#999' }}>字数: {content.length}</p>
        {error && <p className='error-msg'>{error}</p>}
        <div className='form-actions'>
          <button className='btn btn-primary' disabled={saving} onClick={handleUpdate}>{saving ? '保存中...' : '保存'}</button>
          <button className='btn btn-secondary' onClick={() => setEditing(false)}>取消</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='header'><button className='btn btn-secondary' onClick={() => router.back()}>{'\u2190'}返回</button><h1>{memo.title}</h1></div>
      <div className='memo-detail'>
        {(memo.tags || []).length > 0 && <div className='tags-row'>{(memo.tags || []).map(t => <span key={t} className='tag-mini'>{t}</span>)}</div>}
        <div className='content'>{memo.content}</div>
        <p style={{ fontSize: 12, color: '#999', marginTop: 8 }}>字数: {memo.content.length}</p>
        <div className='actions'>
          <button className='btn btn-primary' onClick={() => setEditing(true)}>编辑</button>
          <button className='btn btn-danger' onClick={handleDelete}>删除</button>
        </div>
        {error && <p className='error-msg'>{error}</p>}
      </div>
    </div>
  );
}
