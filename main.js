tsx
import React from 'react';

const AppLayout: React.FC<any> = ({ children }) => {
  // Existing code

  return (
    <html lang="en">
      <head>
        <title>My App</title>
        {/* Existing head content */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default AppLayout;