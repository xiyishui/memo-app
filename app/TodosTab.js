'use client';

import { useState } from 'react';

export default function TodosTab() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const removeTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <div>
      <div className="header">
        <h1>我的代办</h1>
      </div>
      <div className="todo-input-row">
        <input className="todo-input" placeholder="输入待办事项..."
          value={text} onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button className="btn btn-primary" onClick={addTodo}>添加</button>
      </div>
      {todos.length === 0 ? (
        <div className="empty"><p>还没有待办事项</p></div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={'todo-item' + (todo.done ? ' done' : '')}>
              <span className="todo-check" onClick={() => toggleTodo(todo.id)}>
                {todo.done ? '☑' : '☐'}
              </span>
              <span className="todo-text" onClick={() => toggleTodo(todo.id)}>{todo.text}</span>
              <button className="todo-del" onClick={() => removeTodo(todo.id)}>✖</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
