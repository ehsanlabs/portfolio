export const portfolioContentBlobPath = 'portfolio/content.json';
export const certificateBlobPrefix = 'portfolio/certificates/';

export class BlobStorageConfigurationError extends Error {
  constructor() {
    super('Vercel Blob is not connected. Create and connect a private Blob store to this project, then redeploy.');
    this.name = 'BlobStorageConfigurationError';
  }
}

export function hasBlobStorageConfiguration() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export function hasBlobStorageCredentials() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN),
  );
}

export function shouldUseBlobStorage() {
  return process.env.VERCEL === '1' || hasBlobStorageConfiguration();
}

export function requireBlobStorageCredentials() {
  if (!hasBlobStorageCredentials()) {
    throw new BlobStorageConfigurationError();
  }
}
