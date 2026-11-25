import Link from 'next/link';

export const metadata = {
  title: 'Terms of Use | Muhammad Ehsan',
  description: 'Terms of Use for the Muhammad Ehsan portfolio website.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#05070c] px-6 py-12 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-cyan-300 transition hover:text-cyan-200">← Back to portfolio</Link>
        <p className="mt-12 text-xs uppercase tracking-[0.24em] text-cyan-300">Legal</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Terms of Use</h1>
        <p className="mt-4 text-sm text-slate-400">Last updated: November 13, 2026</p>

        <div className="mt-10 space-y-8 text-base leading-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Website content</h2>
            <p className="mt-2">This website presents professional information, projects, services, and portfolio materials for general informational purposes. Content may be updated without notice.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
            <p className="mt-2">You agree to use this website lawfully and respectfully. Do not attempt to disrupt the website, gain unauthorized access, or copy and reuse its content in a misleading way.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Projects and links</h2>
            <p className="mt-2">Project descriptions and external links are provided for reference. External websites, downloads, and services are managed by their respective owners.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Services</h2>
            <p className="mt-2">Information about services or prices on this website is not a binding offer. Scope, availability, timelines, and pricing are confirmed separately for each project.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Changes</h2>
            <p className="mt-2">These terms may be updated when the website or its services change. Continued use of the website after an update means you accept the revised terms.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
