import React from 'react';
import Head from 'next/head';

const RootLayout = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <style>{/* ... (existing styles) */}</style>
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
};

export default RootLayout;