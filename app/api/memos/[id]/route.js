import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';

async function getUser(r) {
  try {
    const tok = (r.headers.get('authorization')||'').replace('Bearer ','');
    if (!tok) return null;
    const { data } = await supabase.from('users').select('*').eq('token', tok).single();
    return data;
  } catch { return null; }
}

export async function GET(request, { params }) {
  try {
    const u = await getUser(request);
    if (!u) return NextResponse.json({e:'x'},{status:401});
    const { id } = await params;
    const { data } = await supabase.from('memos').select('*').eq('id', Number(id)).eq('userid', u.id).single();
    if (!data) return NextResponse.json({e:'x'},{status:404});
    return NextResponse.json(data);
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}

export async function PUT(request, { params }) {
  try {
    const u = await getUser(request);
    if (!u) return NextResponse.json({e:'x'},{status:401});
    const { id } = await params;
    const b = await request.json();
    const updates = { updatedat: new Date().toISOString() };
    if (b.title !== undefined) updates.title = b.title;
    if (b.content !== undefined) updates.content = b.content;
    if (b.pinned !== undefined) updates.pinned = b.pinned;
    if (b.tags !== undefined) updates.tags = b.tags;
    const { data } = await supabase.from('memos').update(updates).eq('id', Number(id)).eq('userid', u.id).select().single();
    if (!data) return NextResponse.json({e:'x'},{status:404});
    return NextResponse.json(data);
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}

export async function DELETE(request, { params }) {
  try {
    const u = await getUser(request);
    if (!u) return NextResponse.json({e:'x'},{status:401});
    const { id } = await params;
    const { data: memo } = await supabase.from('memos').select('*').eq('id', Number(id)).eq('userid', u.id).single();
    if (!memo) return NextResponse.json({e:'x'},{status:404});
    // Move to trash
    const { error: trashErr } = await supabase.from('trash').insert({ id: memo.id, userid: memo.userid, title: memo.title, content: memo.content, tags: memo.tags || [], deletedat: new Date().toISOString() });
    if (trashErr) return NextResponse.json({e:trashErr.message},{status:400});
    await supabase.from('memos').delete().eq('id', Number(id)).eq('userid', u.id);
    return NextResponse.json({message:'ok'});
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}
