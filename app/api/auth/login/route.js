import { NextResponse } from 'next/server';
import { createHash, randomUUID } from 'crypto';
import { supabase } from '../../../lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) return NextResponse.json({error:'请输入用户名和密码'},{status:400});
    const { data: user } = await supabase.from('users').select('*').eq('username', username).single();
    if (!user || user.password !== createHash('sha256').update(password).digest('hex'))
      return NextResponse.json({error:'用户名或密码错误'},{status:401});
    const token = randomUUID() + '-' + randomUUID();
    await supabase.from('users').update({ token }).eq('id', user.id);
    return NextResponse.json({id:user.id, username:user.username, token});
  } catch(e) { return NextResponse.json({error:e.message},{status:500}); }
}
