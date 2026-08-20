tsx
import React from 'react';

export const AppLayout: React.FC<any> = ({ children }) => {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
};