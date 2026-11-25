import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';

const allowedTypes: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export async function POST(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File) || !allowedTypes[file.type]) {
      return NextResponse.json({ error: 'Please upload a JPG, PNG, WEBP, or GIF image.' }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Image must be 5 MB or smaller.' }, { status: 400 });
    }

    const extension = allowedTypes[file.type];
    const filename = `${randomUUID()}.${extension}`;
    const relativePath = `/uploads/certificates/${filename}`;
    const absolutePath = path.join(process.cwd(), 'public', relativePath);
    await fs.mkdir(path.dirname(absolutePath), { recursive: true });
    await fs.writeFile(absolutePath, Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ ok: true, url: relativePath });
  } catch {
    return NextResponse.json({ error: 'Unable to upload image.' }, { status: 500 });
  }
}
