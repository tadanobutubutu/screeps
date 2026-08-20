import React from 'react';
import Head from 'next/head';

const RootLayout = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        <style>{/* ... (existing styles) */}</style>
        <head profile="https://www.w3.org/2005/10/profile"> {/* REACT_017 React Landmarks */}
          <meta charSet="utf-8"/>
          <meta name="viewport" content="width=device-width, initial-scale=1"/>
          <title>Screeps Bot</title>
        </head>
      </head>
      <body>
        <a href="#root" aria-label="Main content" tabIndex={0}>
          <html lang="ja">
            <body>
              {children}
            </body>
          </html>
        </a>
      </body>
    </html>
  );
};

export default RootLayout;