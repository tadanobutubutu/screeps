tsx
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export const size = {
  width: 32,
  height: 32
};

export const contentType = 'image/svg+xml';

export default function Icon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      role="img"
      aria-label="Application logo"
    >
      <title>Application logo</title>
      <path
        d="M4 20V4L12 16L20 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Screeps</title>
        <meta name="description" content="Screeps is a next-generation web-based game that offers a unique blend of exploration, strategy, and player engagement." />
      </Head>
      <main>
        {/* Place your content here */}
      </main>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;