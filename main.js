tsx
import React from 'react';

const Layout = (props) => {
  // Your existing code...
  return (
    <html lang="ja">
      {/* Add the missing <main> element */}
      <main>
        <head>
          <style>{/* Your existing styles */}</style>
        </head>
        <body>
          {/* Replace the anchor with a button for better accessibility */}
          <button id="unrotate" onClick={() => {/* Handle the rotate back action here */}}>rotate back</button>
          {props.children}
        </body>
      </main>
    </html>
  );
};

// Your existing exports...

export default Layout;