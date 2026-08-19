import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

// Add a utility function to ensure only one main element exists
export function ensureSingleMainElement() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    // Convert NodeList to Array for easier manipulation
    const mainArray = Array.from(mains);

    // Keep the first main element and remove the rest
    mainArray.slice(1).forEach(main => {
      // Replace with a section element to maintain semantic structure
      const section = document.createElement('section');
      section.innerHTML = main.innerHTML;
      main.replaceWith(section);
    });
  }
}

// Run the function when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', ensureSingleMainElement);
}