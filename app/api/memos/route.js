import { NextResponse } from 'next/server';
import fs from 'fs'; import path from 'path';
const DF = () => path.join(process.cwd(), 'data', 'memos.json');
const UF = () => path.join(process.cwd(), 'data', 'users.json');
function ensure() {
  if (!fs.existsSync(path.dirname(DF()))) fs.mkdirSync(path.dirname(DF()), { recursive: true });
  if (!fs.existsSync(DF())) fs.writeFileSync(DF(), '[]', 'utf-8');
}
function read() { ensure(); try { return JSON.parse(fs.readFileSync(DF(), 'utf-8')); } catch { fs.writeFileSync(DF(), '[]', 'utf-8'); return []; } }
function write(d) { fs.writeFileSync(DF(), JSON.stringify(d, null, 2), 'utf-8'); }
function user(r) {
  try {
    const tok = (r.headers.get('authorization')||'').replace('Bearer ','');
    if (!tok) return null;
    const us = JSON.parse(fs.readFileSync(UF(), 'utf-8'));
    return us.find(u => u.token === tok) || null;
  } catch { return null; }
}
export async function GET(request) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const all = read().filter(m => m.userId === u.id);
  return NextResponse.json(all.sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||new Date(b.updatedAt)-new Date(a.updatedAt)));
}
export async function POST(request) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const b = await request.json(); if (!b.title || !b.content) return NextResponse.json({e:'x'},{status:400});
  const all = read();
  all.unshift({id:Date.now(),userId:u.id,title:b.title,content:b.content,tags:b.tags||[],pinned:false,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});
  write(all); return NextResponse.json(all[0],{status:201});
}
