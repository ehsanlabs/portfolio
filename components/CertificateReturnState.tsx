'use client';

import { useEffect } from 'react';

export function CertificateReturnState() {
  useEffect(() => {
    sessionStorage.setItem('portfolio-restore-scroll', 'true');
  }, []);

  return null;
}
