import { NextResponse } from 'next/server';
import { supabase } from '../../lib/db';
async function getUser(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const { data } = await supabase.from('users').select('*').eq('token', tok).single(); return data; } catch { return null; }
}
export async function GET(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { data } = await supabase.from('todos').select('*').eq('userid',u.id).order('createdat',{ascending:false}); return NextResponse.json(data||[]); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
export async function POST(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { text } = await request.json(); if (!text||!text.trim()) return NextResponse.json({e:'x'},{status:400}); const { data, error } = await supabase.from('todos').insert({id:Date.now(),userid:u.id,text:text.trim(),done:false,createdat:new Date().toISOString()}).select().single(); if (error || !data) return NextResponse.json({e:error?.message||'x'},{status:400}); return NextResponse.json(data,{status:201}); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
