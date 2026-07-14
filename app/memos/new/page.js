'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast, default as Toast } from '../../toast';
import { useAuth } from '../../auth';

export default function NewMemo() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const { toast, showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/memos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + user.token,
        },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      if (res.status === 401) { router.push('/login'); return; }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '创建失败');
      }

      showToast('创建成功');
      router.push('/');
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <div className="header">
        <h1>新建备忘录</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>标题</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入标题..."
          />
        </div>

        <div className="form-group">
          <label>内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="输入内容..."
          />
        </div>

        {error && <p className="error-msg">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? '保存中...' : '保存'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
            取消
          </button>
        </div>
      </form>

      <Toast toast={toast} />
    </div>
  );
}
