'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../auth';

export default function NewMemo() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!title.trim() || !content.trim()) { setError('标题和内容不能为空'); return; }
    setSaving(true);
    try {
      const r = await fetch('/api/memos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
        body: JSON.stringify({ title: title.trim(), content: content.trim(), tags: tags.split(',').map(t => t.trim()).filter(Boolean) })
      });
      if (!r.ok) throw new Error((await r.json()).error || '创建失败');
      router.push('/');
    } catch (err) { setError(err.message); setSaving(false); }
  };

  if (!user) return null;
  return (
    <div>
      <div className='header'><h1>新建便签</h1></div>
      <form onSubmit={handleSubmit}>
        <div className='form-group'><label>标题</label><input type='text' value={title} onChange={e => setTitle(e.target.value)} placeholder='输入标题...' /></div>
        <div className='form-group'><label>内容</label><textarea value={content} onChange={e => setContent(e.target.value)} placeholder='输入内容...' /></div>
        <div className='form-group'><label>标签（逗号分隔）</label><input type='text' value={tags} onChange={e => setTags(e.target.value)} placeholder='工作, 学习, 生活' /></div>
        <p style={{ fontSize: 12, color: '#999' }}>字数: {content.length}</p>
        {error && <p className='error-msg'>{error}</p>}
        <div className='form-actions'>
          <button type='submit' className='btn btn-primary' disabled={saving}>{saving ? '保存中...' : '保存'}</button>
          <button type='button' className='btn btn-secondary' onClick={() => router.back()}>取消</button>
        </div>
      </form>
    </div>
  );
}
