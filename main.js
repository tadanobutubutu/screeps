tsx
import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Assuming FontAwesomeIcon is used for icons

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Screeps</title>
        <meta
          name="description"
          content="Screeps is a next-generation web-based game that offers a unique blend of exploration, strategy, and player engagement."
        />
        {/* Example of adding aria-label to an SVG component */}
        <link
          rel="icon"
          href="/icons/favicon.svg"
          type="image/svg+xml"
          aria-label="Screeps Favicon"
        />
      </Head>
      <main>{/* Place your content here */}</main>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;