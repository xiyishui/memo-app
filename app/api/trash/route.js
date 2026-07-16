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
    const { data } = await supabase.from('trash').select('*').eq('userid', u.id).order('deletedat', { ascending: false });
    return NextResponse.json(data || []);
  } catch(e) { return NextResponse.json({e:e.message},{status:500}); }
}
