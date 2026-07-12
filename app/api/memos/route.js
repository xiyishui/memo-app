import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'memos.json');

function readMemos() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeMemos(memos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(memos, null, 2), 'utf-8');
}

// GET /api/memos — 获取所有备忘录
export async function GET() {
  const memos = readMemos();
  return NextResponse.json(memos);
}

// POST /api/memos — 创建备忘录
export async function POST(request) {
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  }

  const memos = readMemos();
  const now = new Date().toISOString();
  const newMemo = {
    id: Date.now(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
  memos.unshift(newMemo);
  writeMemos(memos);

  return NextResponse.json(newMemo, { status: 201 });
}
