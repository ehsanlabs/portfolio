import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { certificateSlug, defaultContent, type Certificate } from '@/lib/content';
import { normalizeImageUrl } from '@/lib/image-url';
import { BackToCertificates } from '@/components/BackToCertificates';
import { CertificateReturnState } from '@/components/CertificateReturnState';

const contentPath = path.join(process.cwd(), 'data', 'content.json');

async function loadCertificates(): Promise<Certificate[]> {
  try {
    const stored = JSON.parse(await fs.readFile(contentPath, 'utf8')) as { certificates?: Certificate[] };
    return stored.certificates ?? defaultContent.certificates;
  } catch {
    return defaultContent.certificates;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const certificate = (await loadCertificates()).find((item) => certificateSlug(item.title) === slug);
  return {
    title: certificate ? `${certificate.title} | Muhammad Ehsan` : 'Certificate | Muhammad Ehsan',
    description: certificate?.description ?? 'Certificate and credential details from Muhammad Ehsan.',
  };
}

export default async function CertificateDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const certificate = (await loadCertificates()).find((item) => certificateSlug(item.title) === slug);
  if (!certificate) notFound();

  return (
    <main className="min-h-screen bg-[#05070c] px-6 py-12 text-white">
      <CertificateReturnState />
      <div className="mx-auto max-w-5xl">
        <BackToCertificates />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-slate-950 p-4 shadow-2xl shadow-cyan-950/30">
            <img src={normalizeImageUrl(certificate.image)} alt={certificate.title} className="max-h-[70vh] w-full object-contain" />
          </div>
          <article className="pt-2">
            <span className={`inline-flex rounded-full bg-gradient-to-r ${certificate.color} px-3 py-1 text-xs font-bold text-white`}>{certificate.issuer}</span>
            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">{certificate.title}</h1>
            <p className="mt-4 text-cyan-300">{certificate.issuerFull}</p>
            <p className="mt-2 text-sm text-slate-400">Issued: {certificate.date}</p>
            <p className="mt-8 text-base leading-8 text-slate-300">{certificate.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              {certificate.verifyLink && <a href={certificate.verifyLink} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">Verify credential</a>}
              <Link href="/#letstalk" className="rounded-xl border border-cyan-400/50 px-5 py-3 font-semibold text-cyan-200 transition hover:bg-cyan-400/10">Discuss a project</Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
