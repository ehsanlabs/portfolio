# Muhammad Ehsan - Portfolio

AI & ML Engineer | Web Developer | Content Creator

## Technologies

- Next.js, React, TypeScript
- TensorFlow, PyTorch
- Tailwind CSS, Framer Motion

## Getting Started

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For API credentials and local environment setup, copy `.env.example` to `.env.local` and fill in the values locally. Never commit `.env.local`.

## Admin content storage

The admin API uses local `data/content.json` storage during normal local development. For Vercel, create a **private Vercel Blob** store and connect it to this project for Production and Preview. Vercel Functions resolve Blob OIDC authentication at request time; `BLOB_STORE_ID` is sufficient in that runtime, and the Blob SDK handles token resolution. Do not commit Blob tokens. Local development uses the JSON file unless `BLOB_READ_WRITE_TOKEN` is configured; `BLOB_STORE_ID` alone does not enable local OIDC access.

## Live Demo

[Visit Portfolio](https://portfolio-malik9121.vercel.app)

## Contact

- Email: m.ehsan.contact@gmail.com
- Phone: +92-323-4119975
