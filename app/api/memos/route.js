import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'memos.json');
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
  }
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

function readMemos() {
  ensureDataDir();
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
    return [];
  }
}

function writeMemos(memos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2), 'utf-8');
}

// GET /api/memos — 获取所有备忘录
export async function GET(request) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const memos = readMemos();
  return NextResponse.json(memos.filter(m => m.userId === user.id));
}

// POST /api/memos — 创建备忘录
export async function POST(request) {
  const user = getUserFromToken(request);
  if (!user) return NextResponse.json({ error: '请先登录' }, { status: 401 });
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  }

  const memos = readMemos();
  const now = new Date().toISOString();
  const newMemo = {
    id: Date.now(),
    userId: user.id,
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  memos.unshift(newMemo);
  writeMemos(memos);

  return NextResponse.json(newMemo, { status: 201 });
}
