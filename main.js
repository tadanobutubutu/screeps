tsx
import React from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <main>
        {/* Your component content goes here */}
      </main>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;