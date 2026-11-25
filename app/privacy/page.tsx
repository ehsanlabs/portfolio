import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Muhammad Ehsan',
  description: 'Privacy Policy for the Muhammad Ehsan portfolio website.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#05070c] px-6 py-12 text-white">
      <article className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-cyan-300 transition hover:text-cyan-200">← Back to portfolio</Link>
        <p className="mt-12 text-xs uppercase tracking-[0.24em] text-cyan-300">Legal</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-slate-400">Last updated: November 13, 2026</p>

        <div className="mt-10 space-y-8 text-base leading-8 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Information you provide</h2>
            <p className="mt-2">When you use the contact form, you may provide your name, email address, and message. This information is used only to respond to your inquiry and discuss potential work.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">How information is used</h2>
            <p className="mt-2">Information submitted through this website is used to communicate with you, provide requested information, and improve the website or services. It is not sold or used for unrelated marketing.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Cookies and analytics</h2>
            <p className="mt-2">This portfolio does not intentionally use advertising cookies. Your browser may store basic technical data required for the website to function, and third-party services linked from this website may have their own privacy policies.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">External links</h2>
            <p className="mt-2">This website may link to GitHub, LinkedIn, Google Drive, WhatsApp, or other external services. Those services operate independently and their own privacy policies apply when you visit them.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white">Contact</h2>
            <p className="mt-2">If you have questions about this policy or want to request removal of a message you submitted, please use the contact details on the portfolio.</p>
          </section>
        </div>
      </article>
    </main>
  );
}
