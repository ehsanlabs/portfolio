import { get, put } from '@vercel/blob';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { defaultContent, isPortfolioContent, type PortfolioContent } from '@/lib/content';
import { isAdminRequest } from '@/lib/admin-auth';
import {
  BlobStorageConfigurationError,
  hasBlobStorageConfiguration,
  portfolioContentBlobPath,
  requireBlobStorageCredentials,
  shouldUseBlobStorage,
} from '@/lib/blob-storage';

const contentPath = path.join(process.cwd(), 'data', 'content.json');
const noStoreHeaders = { 'Cache-Control': 'no-store, max-age=0, must-revalidate' };

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function mergeContent(storedContent: Partial<PortfolioContent>): PortfolioContent {
  return {
    ...defaultContent,
    ...storedContent,
    site: { ...defaultContent.site, ...(storedContent.site ?? {}) },
  };
}

async function readLocalContent(): Promise<PortfolioContent> {
  try {
    const storedContent = JSON.parse(await fs.readFile(contentPath, 'utf8')) as Partial<PortfolioContent>;
    return mergeContent(storedContent);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    return defaultContent;
  }
}

async function readContent(): Promise<PortfolioContent> {
  if (!shouldUseBlobStorage() || !hasBlobStorageConfiguration()) {
    return readLocalContent();
  }

  requireBlobStorageCredentials();
  const blob = await get(portfolioContentBlobPath, { access: 'private', useCache: false });
  if (!blob || blob.statusCode !== 200 || !blob.stream) {
    return readLocalContent();
  }

  const storedContent = JSON.parse(await new Response(blob.stream).text()) as Partial<PortfolioContent>;
  return mergeContent(storedContent);
}

async function writeContent(content: PortfolioContent) {
  if (!shouldUseBlobStorage()) {
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2), 'utf8');
    return;
  }

  requireBlobStorageCredentials();
  await put(portfolioContentBlobPath, JSON.stringify(content, null, 2), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
  });
}

function storageErrorResponse(error: unknown, action: 'load' | 'save') {
  if (error instanceof BlobStorageConfigurationError) {
    return NextResponse.json({ error: error.message }, { status: 503, headers: noStoreHeaders });
  }

  console.error(`Unable to ${action} portfolio content.`, error);
  return NextResponse.json(
    { error: `Unable to ${action} portfolio content. Please check the server logs.` },
    { status: 500, headers: noStoreHeaders },
  );
}

export async function GET() {
  try {
    return NextResponse.json(await readContent(), { headers: noStoreHeaders });
  } catch (error) {
    return storageErrorResponse(error, 'load');
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401, headers: noStoreHeaders });
  }

  let content: unknown;
  try {
    content = await request.json();
  } catch {
    return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400, headers: noStoreHeaders });
  }

  if (!isPortfolioContent(content)) {
    return NextResponse.json({ error: 'Invalid portfolio content.' }, { status: 400, headers: noStoreHeaders });
  }

  try {
    await writeContent(content);
    return NextResponse.json({ ok: true, content }, { headers: noStoreHeaders });
  } catch (error) {
    return storageErrorResponse(error, 'save');
  }
}
