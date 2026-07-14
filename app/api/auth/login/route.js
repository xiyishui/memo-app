import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createHash, randomUUID } from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'users.json');
const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
}

function readUsers() {
  ensureDataDir();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

function generateToken() {
  return randomUUID() + '-' + randomUUID();
}

export async function POST(request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: '请输入用户名和密码' }, { status: 400 });
  }

  const users = readUsers();
  const hashed = hashPassword(password);
  const user = users.find(u => u.username === username && u.password === hashed);

  if (!user) {
    return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
  }

  user.token = generateToken();
  writeUsers(users);

  return NextResponse.json({
    id: user.id,
    username: user.username,
    token: user.token,
  });
}
