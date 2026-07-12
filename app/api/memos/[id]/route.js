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

// GET /api/memos/[id] — 获取单个备忘录
export async function GET(_, { params }) {
  const { id } = await params;
  const memos = readMemos();
  const memo = memos.find((m) => m.id === Number(id));

  if (!memo) {
    return NextResponse.json({ error: '备忘录不存在' }, { status: 404 });
  }
  return NextResponse.json(memo);
}

// PUT /api/memos/[id] — 更新备忘录
export async function PUT(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  const { title, content } = body;

  if (!title || !content) {
    return NextResponse.json({ error: '标题和内容不能为空' }, { status: 400 });
  }

  const memos = readMemos();
  const index = memos.findIndex((m) => m.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: '备忘录不存在' }, { status: 404 });
  }

  memos[index] = {
    ...memos[index],
    title,
    content,
    updatedAt: new Date().toISOString(),
  };
  writeMemos(memos);

  return NextResponse.json(memos[index]);
}

// DELETE /api/memos/[id] — 删除备忘录
export async function DELETE(_, { params }) {
  const { id } = await params;
  let memos = readMemos();
  const index = memos.findIndex((m) => m.id === Number(id));

  if (index === -1) {
    return NextResponse.json({ error: '备忘录不存在' }, { status: 404 });
  }

  memos = memos.filter((m) => m.id !== Number(id));
  writeMemos(memos);

  return NextResponse.json({ message: '删除成功' });
}
