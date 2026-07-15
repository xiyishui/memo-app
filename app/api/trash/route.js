import { NextResponse } from 'next/server';
import fs from 'fs'; import path from 'path';
const TF = () => path.join(process.cwd(), 'data', 'trash.json'); const UF = () => path.join(process.cwd(), 'data', 'users.json');
function user(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const us = JSON.parse(fs.readFileSync(UF(),'utf-8')); return us.find(u=>u.token===tok)||null; } catch { return null; }
}
export async function GET(request) {
  const u = user(request); if (!u) return NextResponse.json({e:'x'},{status:401});
  try { const d = JSON.parse(fs.readFileSync(TF(), 'utf-8')); return NextResponse.json(d.filter(x => x.userId === u.id)); } catch { return NextResponse.json([]); }
}