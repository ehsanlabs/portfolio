import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { defaultContent, type PortfolioContent } from '@/lib/content';
import { isAdminRequest } from '@/lib/admin-auth';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

async function readContent(): Promise<PortfolioContent> {
  try {
    const storedContent = JSON.parse(await fs.readFile(contentPath, 'utf8')) as Partial<PortfolioContent>;
    return {
      ...defaultContent,
      ...storedContent,
      site: { ...defaultContent.site, ...storedContent.site },
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await fs.writeFile(contentPath, JSON.stringify(defaultContent, null, 2), 'utf8');
    return defaultContent;
  }
}

export async function GET() {
  try {
    return NextResponse.json(await readContent());
  } catch {
    return NextResponse.json({ error: 'Unable to load portfolio content.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Admin authentication required.' }, { status: 401 });
  }

  try {
    const content = (await request.json()) as PortfolioContent;
    if (!content?.site || !Array.isArray(content.skills) || !Array.isArray(content.projects) || !Array.isArray(content.experiences) || !Array.isArray(content.certificates) || !Array.isArray(content.featuredCertificateIndexes) || !Array.isArray(content.services) || !Array.isArray(content.faqs)) {
      return NextResponse.json({ error: 'Invalid portfolio content.' }, { status: 400 });
    }
    await fs.mkdir(path.dirname(contentPath), { recursive: true });
    await fs.writeFile(contentPath, JSON.stringify(content, null, 2), 'utf8');
    return NextResponse.json({ ok: true, content });
  } catch {
    return NextResponse.json({ error: 'Unable to save portfolio content.' }, { status: 500 });
  }
}
