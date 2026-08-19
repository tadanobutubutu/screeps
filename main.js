import React from 'react';

export default function Layout({ children }) {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}