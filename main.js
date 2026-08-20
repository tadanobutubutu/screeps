tsx
import React from 'react';

const Layout = (props) => {
  // Your existing code...
  return (
    <html lang="ja">
      <head>
        <style>{/* Your existing styles */}</style>
      </head>
      <body>
        <main>
          {/* Add the missing <main> element */}
          {props.children}
        </main>
      </body>
    </html>
  );
};

// Your existing exports...

export default Layout;