import { NextResponse } from 'next/server';
import fs from 'fs'; import path from 'path';
const TF = () => path.join(process.cwd(), 'data', 'trash.json');
const MF = () => path.join(process.cwd(), 'data', 'memos.json');
const UF = () => path.join(process.cwd(), 'data', 'users.json');
function user(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const us = JSON.parse(fs.readFileSync(UF(),'utf-8')); return us.find(u=>u.token===tok)||null; } catch { return null; }
}
export async function POST(request, { params }) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  const { id } = await params;
  let trash = []; try { trash = JSON.parse(fs.readFileSync(TF(), 'utf-8')); } catch {}
  const i = trash.findIndex(x => x.id===Number(id) && x.userId===u.id);
  if (i===-1) return NextResponse.json({e:'x'},{status:404});
  const restored = trash[i]; delete restored.deletedAt;
  let memos = []; try { memos = JSON.parse(fs.readFileSync(MF(), 'utf-8')); } catch { memos = []; }
  memos.unshift(restored);
  trash = trash.filter(x => !(x.id===Number(id) && x.userId===u.id));
  fs.writeFileSync(MF(), JSON.stringify(memos, null, 2), 'utf-8');
  fs.writeFileSync(TF(), JSON.stringify(trash, null, 2), 'utf-8');
  return NextResponse.json({ message: 'ok' });
}