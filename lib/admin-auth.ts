import { createHmac, timingSafeEqual } from 'crypto';

export function createAdminToken(username: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured.');
  return createHmac('sha256', secret).update(username).digest('hex');
}

export function isAdminRequest(request: Request) {
  const username = process.env.ADMIN_USERNAME;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = request.headers.get('cookie')?.match(/(?:^|;\s*)admin_session=([^;]+)/)?.[1];
  if (!username || !secret || !cookie) return false;
  const expected = createHmac('sha256', secret).update(username).digest('hex');
  const supplied = Buffer.from(cookie);
  const stored = Buffer.from(expected);
  return supplied.length === stored.length && timingSafeEqual(supplied, stored);
}
