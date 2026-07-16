import { NextResponse } from 'next/server';
import { supabase } from '../../lib/db';
async function getUser(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const { data } = await supabase.from('users').select('*').eq('token', tok).single(); return data; } catch { return null; }
}
export async function GET(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { data } = await supabase.from('todos').select('*').eq('userId',u.id).order('createdAt',{ascending:false}); return NextResponse.json(data||[]); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
export async function POST(request) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { text } = await request.json(); if (!text||!text.trim()) return NextResponse.json({e:'x'},{status:400}); const { data } = await supabase.from('todos').insert({id:Date.now(),userId:u.id,text:text.trim(),done:false,createdAt:new Date().toISOString()}).select().single(); return NextResponse.json(data,{status:201}); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
