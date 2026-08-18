import React, { useEffect } from 'react';

function updateLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

export default function Main({ children }) {
  useEffect(() => {
    updateLanguageAttribute();
  }, []);

  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
    </body>
  );
}

// Preserve any other existing exports or functions
// Example:
// export function someOtherFunction() { ... }
// export const someVariable = ...;