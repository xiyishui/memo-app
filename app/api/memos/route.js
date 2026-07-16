import { NextResponse } from 'next/server';
import { supabase } from '../../lib/db';

async function getUser(r) {
  try {
    const tok = (r.headers.get('authorization')||'').replace('Bearer ','');
    if (!tok) return null;
    const { data } = await supabase.from('users').select('*').eq('token', tok).single();
    return data;
  } catch { return null; }
}

export async function GET(request) {
  try {
    const u = await getUser(request);
    if (!u) return NextResponse.json({e:'x'},{status:401});
    const { data } = await supabase.from('memos').select('*').eq('userId', u.id).order('pinned', { ascending: false }).order('updatedAt', { ascending: false });
    return NextResponse.json(data || []);
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}

export async function POST(request) {
  try {
    const u = await getUser(request);
    if (!u) return NextResponse.json({e:'x'},{status:401});
    const b = await request.json();
    if (!b.title || !b.content) return NextResponse.json({e:'x'},{status:400});
    const { data } = await supabase.from('memos').insert({ id: Date.now(), userId: u.id, title: b.title, content: b.content, tags: b.tags||[], pinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }).select().single();
    return NextResponse.json(data, {status:201});
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}
