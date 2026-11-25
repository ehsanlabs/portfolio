import { timingSafeEqual } from 'crypto';
import { NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;
    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json({ error: 'Admin credentials are not configured.' }, { status: 500 });
    }
    const validUsername = typeof username === 'string' && username === expectedUsername;
    const suppliedPassword = Buffer.from(typeof password === 'string' ? password : '');
    const storedPassword = Buffer.from(expectedPassword);
    const validPassword = suppliedPassword.length === storedPassword.length && timingSafeEqual(suppliedPassword, storedPassword);
    if (!validUsername || !validPassword) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set('admin_session', createAdminToken(expectedUsername), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      path: '/',
    });
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to sign in.' }, { status: 500 });
  }
}
