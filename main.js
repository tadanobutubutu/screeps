x
import React from 'react';
import '@/styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <main> {/* Add <main> tag */}
      <Component {...pageProps} />
    </main>
  );
}

export default MyApp;