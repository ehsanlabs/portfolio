'use client';

import { FormEvent, useEffect, useState } from 'react';
import { LogOut, Plus, Save, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { Certificate, Experience, Faq, PortfolioContent, Project, Service, Skill } from '@/lib/content';
import { normalizeDriveDownloadUrl, normalizeImageUrl } from '@/lib/image-url';

type Collection = 'projects' | 'experiences' | 'certificates' | 'skills' | 'services' | 'faqs';

const emptyProject: Project = { title: '', tags: [], description: '', link: '', icon: '✨', badge: null };
const emptyExperience: Experience = { role: '', company: '', period: '', location: '', description: '' };
const emptySkill: Skill = { title: '', category: '', description: '', color: 'from-cyan-500 to-blue-600' };
const emptyService: Service = { title: '', desc: '', price: '', icon: '✨' };
const emptyFaq: Faq = { q: '', a: '' };
const emptyCertificate: Certificate = {
  title: '', issuer: '', issuerFull: '', date: '', description: '', image: '', badge: '🏅',
  color: 'from-cyan-500 to-blue-600', borderColor: 'border-cyan-400/40', verifyLink: null,
};

function Field({ label, value, onChange, multiline = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string }) {
  const className = 'w-full rounded-xl border border-cyan-500/20 bg-slate-950/70 px-3 py-2.5 text-sm text-white outline-none transition focus:border-cyan-400';
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</span>
      {multiline ? <textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} className={`${className} resize-y`} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} className={className} />}
    </label>
  );
}

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState<PortfolioContent | null>(null);
  const [collection, setCollection] = useState<Collection>('projects');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    fetch('/api/content').then(async (response) => {
      const result = await response.json() as PortfolioContent & { error?: string };
      if (!response.ok) throw new Error(result.error ?? 'Unable to load content.');
      setContent(result);
    }).catch((loadError: unknown) => setError(loadError instanceof Error ? loadError.message : 'Unable to load content.'));
  }, [loggedIn]);

  async function login(event: FormEvent) {
    event.preventDefault();
    setError('');
    const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
    if (!response.ok) {
      setError((await response.json()).error ?? 'Login failed.');
      return;
    }
    setLoggedIn(true);
    setPassword('');
  }

  async function saveContent() {
    if (!content) return;
    setSaving(true);
    setMessage('');
    setError('');
    try {
      const response = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(content) });
      const result = await response.json() as { error?: string };
      if (!response.ok) setError(result.error ?? 'Save failed.');
      else setMessage('Changes saved. Refresh the public page to see them.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save portfolio content.');
    } finally {
      setSaving(false);
    }
  }

  async function uploadCertificateImage(index: number, file: File) {
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!response.ok) {
      setError((await response.json()).error ?? 'Image upload failed.');
      return;
    }
    const result = await response.json() as { url: string };
    updateCertificateImage(index, result.url);
    setMessage('Image uploaded. Click Save changes to publish it.');
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    setLoggedIn(false);
    setContent(null);
  }

  function updateSite(field: keyof PortfolioContent['site'], value: string | string[]) {
    if (!content) return;
    const nextValue = field === 'cvUrl' && typeof value === 'string' ? normalizeDriveDownloadUrl(value) : value;
    setContent({ ...content, site: { ...content.site, [field]: nextValue } });
  }

  function removeItem(index: number) {
    if (!content) return;
    const nextContent = { ...content, [collection]: content[collection].filter((_, itemIndex) => itemIndex !== index) } as PortfolioContent;
    if (collection === 'certificates') {
      nextContent.featuredCertificateIndexes = (content.featuredCertificateIndexes ?? [])
        .filter((featuredIndex) => featuredIndex !== index)
        .map((featuredIndex) => featuredIndex > index ? featuredIndex - 1 : featuredIndex);
    }
    setContent(nextContent);
  }

  function toggleFeaturedCertificate(index: number) {
    if (!content) return;
    const current = content.featuredCertificateIndexes ?? [];
    if (current.includes(index)) {
      setContent({ ...content, featuredCertificateIndexes: current.filter((featuredIndex) => featuredIndex !== index) });
      return;
    }
    if (current.length >= 3) {
      setError('Only 3 featured certificates can appear on the home page.');
      return;
    }
    setContent({ ...content, featuredCertificateIndexes: [...current, index] });
  }

  function addItem() {
    if (!content) return;
    const item = collection === 'projects' ? emptyProject : collection === 'experiences' ? emptyExperience : collection === 'certificates' ? emptyCertificate : collection === 'skills' ? emptySkill : collection === 'services' ? emptyService : emptyFaq;
    setContent({ ...content, [collection]: [...content[collection], item] } as PortfolioContent);
  }

  if (!loggedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05070c] px-4 text-white">
        <form onSubmit={login} className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-8 shadow-2xl shadow-cyan-950/30">
          <div className="mb-8 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-300"><ShieldCheck size={24} /></div>
            <div><p className="text-xs uppercase tracking-[0.22em] text-cyan-300">Private area</p><h1 className="text-2xl font-bold">Admin sign in</h1></div>
          </div>
          <div className="space-y-4">
            <Field label="Username" value={username} onChange={setUsername} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
          </div>
          {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">{error}</p>}
          <button className="mt-6 w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">Continue to dashboard</button>
          <Link href="/" className="mt-5 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-cyan-300"><ArrowLeft size={16} /> Back to portfolio</Link>
        </form>
      </main>
    );
  }

  if (!content) return <main className="flex min-h-screen items-center justify-center bg-[#05070c] text-cyan-300">Loading dashboard…</main>;

  const updateProject = (index: number, patch: Partial<Project>) => setContent({ ...content, projects: content.projects.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const updateExperience = (index: number, patch: Partial<Experience>) => setContent({ ...content, experiences: content.experiences.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const updateCertificate = (index: number, patch: Partial<Certificate>) => setContent({ ...content, certificates: content.certificates.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const updateCertificateImage = (index: number, value: string) => updateCertificate(index, { image: normalizeImageUrl(value) });
  const updateSkill = (index: number, patch: Partial<Skill>) => setContent({ ...content, skills: content.skills.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const updateService = (index: number, patch: Partial<Service>) => setContent({ ...content, services: content.services.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });
  const updateFaq = (index: number, patch: Partial<Faq>) => setContent({ ...content, faqs: content.faqs.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item) });

  return (
    <main className="min-h-screen bg-[#05070c] text-white">
      <header className="border-b border-cyan-500/15 bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <div><p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Portfolio control room</p><h1 className="text-2xl font-bold">Admin dashboard</h1></div>
          <div className="flex gap-3"><Link href="/" className="hidden items-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-cyan-400 sm:flex"><ArrowLeft size={16} /> Portfolio</Link><button onClick={logout} className="flex items-center gap-2 rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-200 hover:bg-red-400/10"><LogOut size={16} /> Logout</button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-2">
          <p className="mb-3 text-xs uppercase tracking-widest text-slate-500">Manage content</p>
          {(['projects', 'experiences', 'certificates', 'skills', 'services', 'faqs'] as Collection[]).map((item) => <button key={item} onClick={() => setCollection(item)} className={`w-full rounded-xl px-4 py-3 text-left text-sm capitalize transition ${collection === item ? 'bg-cyan-400 font-semibold text-slate-950' : 'text-slate-300 hover:bg-slate-800'}`}>{item}</button>)}
          <p className="mt-7 mb-3 text-xs uppercase tracking-widest text-slate-500">Site copy</p>
          <button onClick={() => setCollection('projects')} className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-300 hover:bg-slate-800">Hero &amp; About below</button>
        </nav>
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h2 className="text-3xl font-bold capitalize">{collection}</h2><p className="mt-1 text-sm text-slate-400">Add, edit, or remove items shown on the public portfolio.</p></div><div className="flex gap-3"><button onClick={addItem} className="flex items-center gap-2 rounded-xl border border-cyan-400/40 px-4 py-2.5 text-sm text-cyan-200 hover:bg-cyan-400/10"><Plus size={16} /> Add new</button><button onClick={saveContent} disabled={saving} className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 disabled:opacity-50"><Save size={16} /> {saving ? 'Saving…' : 'Save changes'}</button></div></div>
          {message && <p className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{message}</p>}
          {error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}

          <div className="space-y-5">
            {collection === 'projects' && content.projects.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-cyan-200">Project {index + 1}</h3><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title" value={item.title} onChange={(value) => updateProject(index, { title: value })} /><Field label="GitHub / project link" value={item.link} onChange={(value) => updateProject(index, { link: value })} /><Field label="Tags (comma separated)" value={item.tags.join(', ')} onChange={(value) => updateProject(index, { tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })} /><Field label="Badge" value={item.badge ?? ''} onChange={(value) => updateProject(index, { badge: value || null })} /><div className="md:col-span-2"><Field label="Description" value={item.description} onChange={(value) => updateProject(index, { description: value })} multiline /></div></div></article>)}
            {collection === 'experiences' && content.experiences.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-cyan-200">Experience {index + 1}</h3><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Role" value={item.role} onChange={(value) => updateExperience(index, { role: value })} /><Field label="Company" value={item.company} onChange={(value) => updateExperience(index, { company: value })} /><Field label="Period" value={item.period} onChange={(value) => updateExperience(index, { period: value })} /><Field label="Location" value={item.location} onChange={(value) => updateExperience(index, { location: value })} /><div className="md:col-span-2"><Field label="Description" value={item.description} onChange={(value) => updateExperience(index, { description: value })} multiline /></div></div></article>)}
            {collection === 'certificates' && content.certificates.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><div><h3 className="font-semibold text-cyan-200">Certificate {index + 1}</h3><label className="mt-2 flex items-center gap-2 text-xs text-slate-300"><input type="checkbox" checked={(content.featuredCertificateIndexes ?? []).includes(index)} onChange={() => toggleFeaturedCertificate(index)} className="accent-cyan-400" /> Show on home page</label></div><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Certificate title" value={item.title} onChange={(value) => updateCertificate(index, { title: value })} /><Field label="Issuer" value={item.issuer} onChange={(value) => updateCertificate(index, { issuer: value })} /><Field label="Issuer full name" value={item.issuerFull} onChange={(value) => updateCertificate(index, { issuerFull: value })} /><Field label="Date" value={item.date} onChange={(value) => updateCertificate(index, { date: value })} /><div className="md:col-span-2"><Field label="Drive link or direct image URL" value={item.image} onChange={(value) => updateCertificateImage(index, value)} /><p className="mt-1 text-xs text-slate-500">For Google Drive: set sharing to “Anyone with the link” and paste the share link.</p></div><div className="md:col-span-2 flex flex-wrap items-center gap-4"><label className="cursor-pointer rounded-xl border border-cyan-400/30 px-4 py-2.5 text-sm text-cyan-200 hover:bg-cyan-400/10">Upload image<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadCertificateImage(index, file); }} /></label>{item.image && <img src={normalizeImageUrl(item.image)} alt={`${item.title} preview`} className="h-20 w-32 rounded-lg border border-cyan-500/20 object-cover" onError={(event) => { event.currentTarget.style.display = 'none'; }} />}</div><Field label="Verification link" value={item.verifyLink ?? ''} onChange={(value) => updateCertificate(index, { verifyLink: value || null })} /><div className="md:col-span-2"><Field label="Description" value={item.description} onChange={(value) => updateCertificate(index, { description: value })} multiline /></div></div></article>)}
            {collection === 'skills' && content.skills.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-cyan-200">Skill {index + 1}</h3><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title" value={item.title} onChange={(value) => updateSkill(index, { title: value })} /><Field label="Category" value={item.category} onChange={(value) => updateSkill(index, { category: value })} /><Field label="Description" value={item.description} onChange={(value) => updateSkill(index, { description: value })} multiline /><Field label="Color classes" value={item.color} onChange={(value) => updateSkill(index, { color: value })} /></div></article>)}
            {collection === 'services' && content.services.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-cyan-200">Service {index + 1}</h3><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="grid gap-4 md:grid-cols-2"><Field label="Title" value={item.title} onChange={(value) => updateService(index, { title: value })} /><Field label="Icon" value={item.icon} onChange={(value) => updateService(index, { icon: value })} /><Field label="Description" value={item.desc} onChange={(value) => updateService(index, { desc: value })} multiline /><Field label="Price label" value={item.price} onChange={(value) => updateService(index, { price: value })} /></div></article>)}
            {collection === 'faqs' && content.faqs.map((item, index) => <article key={index} className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5"><div className="mb-4 flex items-center justify-between"><h3 className="font-semibold text-cyan-200">FAQ {index + 1}</h3><button onClick={() => removeItem(index)} className="text-red-300 hover:text-red-200"><Trash2 size={17} /></button></div><div className="space-y-4"><Field label="Question" value={item.q} onChange={(value) => updateFaq(index, { q: value })} /><Field label="Answer" value={item.a} onChange={(value) => updateFaq(index, { a: value })} multiline /></div></article>)}
          </div>

          <div className="rounded-2xl border border-cyan-500/15 bg-slate-900/65 p-5">
            <h2 className="mb-4 text-xl font-bold">Hero &amp; About text</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name" value={content.site.name} onChange={(value) => updateSite('name', value)} />
              <Field label="Availability badge" value={content.site.heroAvailability} onChange={(value) => updateSite('heroAvailability', value)} />
              <Field label="Tagline" value={content.site.tagline} onChange={(value) => updateSite('tagline', value)} />
              <div className="md:col-span-2 rounded-xl border border-cyan-500/15 bg-slate-950/40 p-4"><p className="mb-3 text-xs font-medium uppercase tracking-wide text-cyan-300">Hero title lines (fixed style and position)</p><div className="grid gap-4 md:grid-cols-3"><Field label="Line 1" value={content.site.heroTitleLines[0] ?? ''} onChange={(value) => setContent({ ...content, site: { ...content.site, heroTitleLines: [value, content.site.heroTitleLines[1] ?? '', content.site.heroTitleLines[2] ?? ''] } })} /><Field label="Gradient line 1" value={content.site.heroTitleLines[1] ?? ''} onChange={(value) => setContent({ ...content, site: { ...content.site, heroTitleLines: [content.site.heroTitleLines[0] ?? '', value, content.site.heroTitleLines[2] ?? ''] } })} /><Field label="Gradient line 2" value={content.site.heroTitleLines[2] ?? ''} onChange={(value) => setContent({ ...content, site: { ...content.site, heroTitleLines: [content.site.heroTitleLines[0] ?? '', content.site.heroTitleLines[1] ?? '', value] } })} /></div></div>
              <div className="md:col-span-2"><Field label="Role badges (separate with commas)" value={content.site.heroBadges.join(', ')} onChange={(value) => updateSite('heroBadges', value.split(',').map((item) => item.trim()).filter(Boolean))} /></div>
              <div className="md:col-span-2"><Field label="Hero description" value={content.site.heroDescription} onChange={(value) => updateSite('heroDescription', value)} multiline /></div>
              <Field label="About paragraph 1" value={content.site.aboutFirst} onChange={(value) => updateSite('aboutFirst', value)} multiline />
              <Field label="About paragraph 2" value={content.site.aboutSecond} onChange={(value) => updateSite('aboutSecond', value)} multiline />
              <div className="md:col-span-2"><Field label="CV Drive link" value={content.site.cvUrl} onChange={(value) => updateSite('cvUrl', value)} /><p className="mt-1 text-xs text-slate-500">Set the Drive file sharing to “Anyone with the link”.</p></div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
