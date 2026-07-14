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
  if (!username || !password || username.length < 2 || password.length < 3) {
    return NextResponse.json({ error: '\u7528\u6237\u540d\u81f3\u5c112\u4f4d\uff0c\u5bc6\u7801\u81f3\u5c113\u4f4d' }, { status: 400 });
  }
  const users = readUsers();
  if (users.find(u => u.username === username)) {
    return NextResponse.json({ error: '\u7528\u6237\u540d\u5df2\u88ab\u6ce8\u518c' }, { status: 400 });
  }
  const newUser = {
    id: Date.now(), username,
    password: hashPassword(password),
    token: generateToken(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  writeUsers(users);
  return NextResponse.json({ id: newUser.id, username: newUser.username, token: newUser.token }, { status: 201 });
}
