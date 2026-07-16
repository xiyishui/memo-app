import { NextResponse } from 'next/server';
import { supabase } from '../../lib/db';
async function getUser(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const { data } = await supabase.from('users').select('*').eq('token', tok).single(); return data; } catch { return null; }
}
export async function GET(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { data } = await supabase.from('recent').select('*').eq('userId',u.id).order('viewedAt',{ascending:false}).limit(20); return NextResponse.json(data||[]); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
export async function POST(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { memoId, title } = await request.json(); await supabase.from('recent').delete().eq('userId',u.id).eq('memoId',memoId); await supabase.from('recent').insert({userId:u.id,memoId,title:title||'',viewedAt:new Date().toISOString()}); return NextResponse.json({message:'ok'}); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
