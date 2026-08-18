tsx
import React from 'react';

export const AppLayout: React.FC<{ children: JSX.Element }> = ({ children }) => {
  return (
    <body className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children}
      </main>
    </body>
  );
};