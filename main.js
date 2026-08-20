import React from 'react';

const Layout = (props) => {
  const { children } = props;
  return (
    <html lang="ja">
      <head>
        <style>{/* Your existing styles */}</style>
      </head>
      <body>
        <main aria-label="main content">
          {children}
        </main>
      </body>
    </html>
  );
};

// Your existing exports...

export default Layout;