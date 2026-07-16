import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';
async function getUser(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const { data } = await supabase.from('users').select('*').eq('token', tok).single(); return data; } catch { return null; }
}
export async function PUT(request, { params }) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { id } = await params; const b = await request.json(); const updates = {}; if (b.text !== undefined) updates.text = b.text; if (b.done !== undefined) updates.done = b.done; const { data } = await supabase.from('todos').update(updates).eq('id',Number(id)).eq('userId',u.id).select().single(); if (!data) return NextResponse.json({e:'x'},{status:404}); return NextResponse.json(data); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
export async function DELETE(request, { params }) {
  try { const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401}); const { id } = await params; await supabase.from('todos').delete().eq('id',Number(id)).eq('userId',u.id); return NextResponse.json({message:'ok'}); } catch { return NextResponse.json({e:'x'},{status:500}); }
}
