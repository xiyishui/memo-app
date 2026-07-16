import { NextResponse } from 'next/server';
import { createHash, randomUUID } from 'crypto';
import { supabase } from '../../../lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) return NextResponse.json({error:'请输入用户名和密码'},{status:400});
    const { data: user, error: findErr } = await supabase.from('users').select('*').eq('username', username).single();
    if (findErr || !user) return NextResponse.json({error:'用户名或密码错误'},{status:401});
    if (user.password !== createHash('sha256').update(password).digest('hex'))
      return NextResponse.json({error:'用户名或密码错误'},{status:401});
    const token = randomUUID() + '-' + randomUUID();
    const { error: updErr } = await supabase.from('users').update({ token }).eq('id', user.id);
    if (updErr) return NextResponse.json({error:updErr.message},{status:500});
    return NextResponse.json({id:user.id, username:user.username, token});
  } catch(e) {
    return NextResponse.json({error:e.message},{status:500});
  }
}
