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

export async function PUT(request, { params }) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  const todos = readTodos();
  const index = todos.findIndex(t => t.id === Number(id) && t.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (body.text !== undefined) todos[index].text = body.text;
  if (body.done !== undefined) todos[index].done = body.done;
  writeTodos(todos);
  return NextResponse.json(todos[index]);
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  let todos = readTodos();
  const index = todos.findIndex(t => t.id === Number(id) && t.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  todos = todos.filter(t => !(t.id === Number(id) && t.userId === user.id));
  writeTodos(todos);
  return NextResponse.json({ message: 'Deleted' });
}
