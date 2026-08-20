tsx
import React from 'react';
import Head from 'next/head';

function Layout({ children }) {
  return (
    <html lang="ja">
      <Head>
        ...
      </Head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

export default Layout;