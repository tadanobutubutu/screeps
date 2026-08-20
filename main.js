tsx
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Screeps</title>
        <meta
          name="description"
          content="Screeps is a next-generation web-based game that offers a unique blend of exploration, strategy, and player engagement."
        />
      </Head>
      <main>{/* Place your content here */}</main>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;