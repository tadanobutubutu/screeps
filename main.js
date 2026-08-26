// main.js
import React from 'react';

function MyApp() {
  return (
    <html>
      {/* Missing lang attribute */}
      <head>
        <title>My App</title>
      </head>
      <body>
        <div>
          {/* App content here */}
        </div>
      </body>
    </html>
  );
}

export default MyApp;