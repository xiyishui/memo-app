import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';
async function getUser(r) {
  try { const tok = (r.headers.get('authorization')||'').replace('Bearer ',''); if (!tok) return null; const { data } = await supabase.from('users').select('*').eq('token', tok).single(); return data; } catch { return null; }
}
export async function POST(request, { params }) {
  try {
    const u = await getUser(request); if (!u) return NextResponse.json({e:'x'},{status:401});
    const { id } = await params;
    const { data: trash } = await supabase.from('trash').select('*').eq('id',Number(id)).eq('userid',u.id).single();
    if (!trash) return NextResponse.json({e:'x'},{status:404});
    const restored = { id:trash.id, userid:trash.userid, title:trash.title, content:trash.content, tags:trash.tags||[], pinned:false, createdat:trash.createdat, updatedat:new Date().toISOString() };
    await supabase.from('memos').insert(restored);
    await supabase.from('trash').delete().eq('id',Number(id)).eq('userid',u.id);
    return NextResponse.json({message:'ok'});
  } catch(e) { return NextResponse.json({error:e.message},{status:500}); }
}
