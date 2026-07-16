import { NextResponse } from 'next/server';
import { createHash, randomUUID } from 'crypto';
import { supabase } from '../../../lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password || username.length < 2 || password.length < 6)
      return NextResponse.json({error:'用户名至少2位，密码至少6位'},{status:400});
    const { data: existing } = await supabase.from('users').select('id').eq('username', username).maybeSingle();
    if (existing) return NextResponse.json({error:'用户名已被注册'},{status:400});
    const hash = createHash('sha256').update(password).digest('hex');
    const newUser = { id: Date.now(), username, password: hash, token: randomUUID()+'\\x2D'+randomUUID(), createdAt: new Date().toISOString() };
    const { data } = await supabase.from('users').insert(newUser).select().single();
    return NextResponse.json({id:data.id,username:data.username,token:data.token},{status:201});
  } catch(e) { return NextResponse.json({error:e.message},{status:500}); }
}
