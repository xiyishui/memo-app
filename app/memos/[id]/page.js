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
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/memos/' + id, {
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
      .then(r => r.json())
      .then(d => {
        if (d.error) setError(d.error);
        else setMemo(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!confirm('delete?')) return;
    await fetch('/api/memos/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + user.token }
    });
    router.push('/');
  };

  if (!user) return null;
  if (loading) return <div className='loading'>loading...</div>;
  if (error && !memo) return <div className='empty'><p>{error}</p></div>;
  if (!memo) return <div className='empty'><p>not found</p></div>;

  return (
    <div>
      <div className='header'><h1>{memo.title}</h1></div>
      <div className='memo-detail'>
        <div className='content'>{memo.content}</div>
        <div className='actions'>
          <button className='btn btn-primary' onClick={() => setEditing(true)}>edit</button>
          <button className='btn btn-danger' onClick={handleDelete}>delete</button>
          <button className='btn btn-secondary' onClick={() => router.back()}>back</button>
        </div>
        {error && <p className='error-msg'>{error}</p>}
      </div>
    </div>
  );
}
