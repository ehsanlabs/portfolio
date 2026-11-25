'use client';

import { useRouter } from 'next/navigation';

export function BackToCertificates() {
  const router = useRouter();

  function goBack() {
    sessionStorage.setItem('portfolio-restore-scroll', 'true');
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push('/#certificates');
  }

  return (
    <button type="button" onClick={goBack} className="text-sm text-cyan-300 transition hover:text-cyan-200">
      ← Back to certificates
    </button>
  );
}
