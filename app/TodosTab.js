'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './auth';

export default function TodosTab() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    if (!user) return;
    fetch('/api/todos', {
      headers: { 'Authorization': 'Bearer ' + user.token }
    })
      .then(res => res.json())
      .then(data => { if (data) setTodos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const addTodo = async () => {
    if (!text.trim() || !user) return;
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({ text: text.trim() }),
    });
    if (res.ok) {
      const todo = await res.json();
      setTodos(todo && todo.id ? [todo, ...todos] : todos);
    }
    setText('');
  };

  const toggleTodo = async (todo) => {
    if (!user) return;
    await fetch('/api/todos/' + todo.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({ done: !todo.done }),
    });
    setTodos(todos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t));
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim() || !user) return;
    await fetch('/api/todos/' + id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + user.token },
      body: JSON.stringify({ text: editText.trim() }),
    });
    setTodos(todos.map(t => t.id === id ? { ...t, text: editText.trim() } : t));
    setEditingId(null);
    setEditText('');
  };

  const removeTodo = async (id) => {
    if (!user) return;
    await fetch('/api/todos/' + id, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + user.token },
    });
    setTodos(todos.filter(t => t.id !== id));
  };

  if (!user) return <div className='empty'><p>请先登录</p></div>;

  return (
    <div>
      <div className='header'>
        <h1>我的代办</h1>
        <span className='toolbar-count'>{todos.filter(t => t && t.done === false).length} 未完成</span>
      </div>
      <div className='todo-input-row'>
        <input className='todo-input' placeholder='输入待办事项...'
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button className='btn btn-primary' onClick={addTodo}>添加</button>
      </div>
      {loading ? (
        <div className='loading'>加载中...</div>
      ) : todos.length === 0 ? (
        <div className='empty'><p>还没有待办事项</p></div>
      ) : (
        <ul className='todo-list'>
          {todos.map(todo => (
            <li key={todo.id} className={'todo-item' + (todo.done ? ' done' : '')}>
              <span className='todo-check' onClick={() => toggleTodo(todo)}>
                {todo.done ? '\u2611' : '\u2610'}
              </span>
              {editingId === todo.id ? (
                <input className='todo-edit-input' value={editText}
                  onChange={e => setEditText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(todo.id); if (e.key === 'Escape') setEditingId(null); }}
                  autoFocus
                />
              ) : (
                <span className='todo-text' onClick={() => toggleTodo(todo)}>{todo.text}</span>
              )}
              {editingId === todo.id ? (
                <button className='todo-del' onClick={() => saveEdit(todo.id)}>\u2714</button>
              ) : (
                <button className='todo-del' onClick={() => startEdit(todo)}>\u270F</button>
              )}
              <button className='todo-del' onClick={() => removeTodo(todo.id)}>\u2718</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
