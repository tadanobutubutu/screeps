import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My App</title>
      </head>
      <body>
        <div id="root">
          <App />
        </div>
      </body>
    </html>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Root />);