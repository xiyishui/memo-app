import { NextResponse } from 'next/server';
import fs from 'fs'; import path from 'path';
const DF = () => path.join(process.cwd(), 'data', 'memos.json'); const UF = () => path.join(process.cwd(), 'data', 'users.json');
function read() { try { return JSON.parse(fs.readFileSync(DF(), 'utf-8')); } catch { return []; } }
function write(d) { fs.writeFileSync(DF(), JSON.stringify(d, null, 2), 'utf-8'); }
function user(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const us = JSON.parse(fs.readFileSync(UF(),'utf-8')); return us.find(u=>u.token===tok)||null; } catch { return null; }
}
export async function GET(request, { params }) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const { id } = await params; const all = read(); const m = all.find(x => x.id===Number(id) && x.userid===u.id);
  if (!m) return NextResponse.json({e:'x'},{status:404});
  return NextResponse.json(m);
}
export async function PUT(request, { params }) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const { id } = await params; const b = await request.json();
  const all = read(); const i = all.findIndex(x => x.id===Number(id) && x.userid===u.id);
  if (i===-1) return NextResponse.json({e:'x'},{status:404});
  if (b.title !== undefined) all[i].title = b.title;
  if (b.content !== undefined) all[i].content = b.content;
  if (b.pinned !== undefined) all[i].pinned = b.pinned;
  if (b.tags !== undefined) all[i].tags = b.tags;
  all[i].updatedat = new Date().toISOString();
  write(all); return NextResponse.json(all[i]);
}
export async function DELETE(request, { params }) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const { id } = await params;
  const all = read(); const i = all.findIndex(x => x.id===Number(id) && x.userid===u.id);
  if (i===-1) return NextResponse.json({e:'x'},{status:404});
  const trashed = { ...all[i], deletedat: new Date().toISOString() };
  delete trashed.pinned;
  const tf = path.join(process.cwd(), 'data', 'trash.json');
  if (!fs.existsSync(path.dirname(tf))) fs.mkdirSync(path.dirname(tf), { recursive: true });
  let trash = []; try { trash = JSON.parse(fs.readFileSync(tf, 'utf-8')); } catch {}
  trash.unshift(trashed); fs.writeFileSync(tf, JSON.stringify(trash, null, 2), 'utf-8');
  write(all.filter(x => !(x.id===Number(id) && x.userid===u.id)));
  return NextResponse.json({ message: 'ok' });
}