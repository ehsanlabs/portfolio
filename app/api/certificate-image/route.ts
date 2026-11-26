import { get } from '@vercel/blob';
import { NextResponse } from 'next/server';
import {
  BlobStorageConfigurationError,
  certificateBlobPrefix,
  hasBlobStorageConfiguration,
  requireBlobStorageCredentials,
} from '@/lib/blob-storage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const filenamePattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(?:jpg|png|webp|gif)$/i;

export async function GET(request: Request) {
  const filename = new URL(request.url).searchParams.get('file');
  if (!filename || !filenamePattern.test(filename)) {
    return NextResponse.json({ error: 'Invalid certificate image.' }, { status: 400 });
  }
  if (!hasBlobStorageConfiguration()) {
    return NextResponse.json({ error: 'Certificate image not found.' }, { status: 404 });
  }

  try {
    requireBlobStorageCredentials();
    const blob = await get(`${certificateBlobPrefix}${filename}`, { access: 'private', useCache: false });
    if (!blob || blob.statusCode !== 200 || !blob.stream) {
      return NextResponse.json({ error: 'Certificate image not found.' }, { status: 404 });
    }

    return new Response(blob.stream, {
      headers: {
        'Content-Type': blob.blob.contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof BlobStorageConfigurationError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('Unable to read certificate image from Vercel Blob.', error);
    return NextResponse.json({ error: 'Unable to load certificate image.' }, { status: 500 });
  }
}
