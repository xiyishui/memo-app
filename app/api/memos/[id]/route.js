import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'memos.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function readMemos() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
    return [];
  }
}

function writeMemos(memos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2), 'utf-8');
}

function getUserFromToken(request) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace('Bearer ', '');
  if (!token) return null;
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    return users.find(u => u.token === token) || null;
  } catch {
    return null;
  }
}

export async function GET(request, { params }) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const memos = readMemos();
  const memo = memos.find((m) => m.id === Number(id) && m.userId === user.id);
  if (!memo) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(memo);
}

export async function PUT(request, { params }) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const body = await request.json();
  if (!body.title || !body.content) return NextResponse.json({ error: 'Invalid' }, { status: 400 });
  const memos = readMemos();
  const index = memos.findIndex((m) => m.id === Number(id) && m.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  memos[index].title = body.title;
  memos[index].content = body.content;
  memos[index].updatedAt = new Date().toISOString();
  writeMemos(memos);
  return NextResponse.json(memos[index]);
}

export async function DELETE(request, { params }) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  let memos = readMemos();
  const index = memos.findIndex((m) => m.id === Number(id) && m.userId === user.id);
  if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  memos = memos.filter((m) => !(m.id === Number(id) && m.userId === user.id));
  writeMemos(memos);
  return NextResponse.json({ message: 'Deleted' });
}
