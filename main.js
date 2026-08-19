import React from 'react';
import { Children } from 'react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

// Preserve all existing exports and functions
export function getServerSideProps(context) {
  // Your existing server-side props logic
}

export function getStaticProps(context) {
  // Your existing static props logic
}

// Any other existing functions or exports should remain unchanged