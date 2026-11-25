export function normalizeImageUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const fileId = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1]
    ?? trimmed.match(/[?&]id=([^&]+)/)?.[1];

  return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : trimmed;
}

export function normalizeDriveDownloadUrl(value: string) {
  const trimmed = value.trim();
  const fileId = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/)?.[1]
    ?? trimmed.match(/[?&]id=([^&]+)/)?.[1];
  return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : trimmed;
}
