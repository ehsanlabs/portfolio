export const portfolioContentBlobPath = 'portfolio/content.json';
export const certificateBlobPrefix = 'portfolio/certificates/';

export class BlobStorageConfigurationError extends Error {
  constructor(message = 'Vercel Blob is not connected. Create and connect a private Blob store to this project, then redeploy.') {
    super(message);
    this.name = 'BlobStorageConfigurationError';
  }
}

export function hasBlobStorageConfiguration() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function hasBlobStorageCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.BLOB_STORE_ID && process.env.VERCEL === '1'),
  );
}

export function shouldUseBlobStorage() {
  return process.env.NODE_ENV === 'production' || process.env.VERCEL === '1' || hasBlobStorageConfiguration();
}

export function requireBlobStorageCredentials() {
  if (!hasBlobStorageCredentials()) {
    if (process.env.BLOB_STORE_ID) {
      throw new BlobStorageConfigurationError(
        'BLOB_READ_WRITE_TOKEN is required outside Vercel Functions. BLOB_STORE_ID-only OIDC authentication is resolved inside Vercel Functions.',
      );
    }
    throw new BlobStorageConfigurationError();
  }
}
