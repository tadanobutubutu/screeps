tsx
// Replace or wrap the body with <main> if you're using React
import React from 'react';

const AppLayout: React.FC = ({ children }) => {
  return (
    <html lang="ja">
      <head>
        {/* existing head elements */}
      </head>
      <body>
        {/* wrap the primary content here */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
};

export default AppLayout;