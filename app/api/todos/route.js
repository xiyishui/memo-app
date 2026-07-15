import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'todos.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function readTodos() {
  ensureData();
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8')); }
  catch { return []; }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

function getUserFromToken(request) {
  try {
    const auth = request.headers.get('authorization') || '';
    const token = auth.replace('Bearer ', '');
    if (!token) return null;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    return users.find(u => u.token === token) || null;
  } catch { return null; }
}

export async function GET(request) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const todos = readTodos();
  return NextResponse.json(todos.filter(t => t.userId === user.id));
}

export async function POST(request) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { text } = await request.json();
  if (!text || !text.trim()) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const todos = readTodos();
  const newTodo = { id: Date.now(), userId: user.id, text: text.trim(), done: false, createdAt: new Date().toISOString() };
  todos.unshift(newTodo);
  writeTodos(todos);
  return NextResponse.json(newTodo, { status: 201 });
}
