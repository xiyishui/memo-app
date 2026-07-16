import { NextResponse } from 'next/server';
import { createHash, randomUUID } from 'crypto';
import { supabase } from '../../../lib/db';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password || username.length < 2 || password.length < 6)
      return NextResponse.json({error:'用户名至少2位，密码至少6位'},{status:400});
    const hash = createHash('sha256').update(password).digest('hex');
    const newUser = {
      id: Date.now(),
      username: username,
      password: hash,
      token: randomUUID() + '-' + randomUUID(),
      // createdat: new Date().toISOString()
    };
    // Remove createdat - DB has DEFAULT NOW()
    delete newUser.createdat;
    const { data, error } = await supabase.from('users').insert(newUser).select().single();
    if (error || !data) return NextResponse.json({error: error?.message || '注册失败'}, {status:500});
    return NextResponse.json({id:data.id,username:data.username,token:data.token},{status:201});
  } catch(e) {
    return NextResponse.json({error:e.message},{status:500});
  }
}
