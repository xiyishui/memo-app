import { NextResponse } from 'next/server';
import fs from 'fs'; import path from 'path';
const RF = () => path.join(process.cwd(), 'data', 'recent.json'); const UF = () => path.join(process.cwd(), 'data', 'users.json');
function user(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const us = JSON.parse(fs.readFileSync(UF(),'utf-8')); return us.find(u=>u.token===tok)||null; } catch { return null; }
}
export async function GET(request) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  try { const d = JSON.parse(fs.readFileSync(RF(), 'utf-8')); return NextResponse.json(d.filter(x=>x.userId===u.id).sort((a,b)=>new Date(b.viewedAt)-new Date(a.viewedAt)).slice(0,20)); } catch { return NextResponse.json([]); }
}
export async function POST(request) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const { memoId, title } = await request.json();
  let d = []; try { d = JSON.parse(fs.readFileSync(RF(), 'utf-8')); } catch {}
  d = d.filter(x => !(x.userId===u.id && x.memoId===memoId));
  d.unshift({userId: u.id, memoId, title: title||'', viewedAt: new Date().toISOString()});
  fs.writeFileSync(RF(), JSON.stringify(d, null, 2), 'utf-8');
  return NextResponse.json({ message: 'ok' });
}