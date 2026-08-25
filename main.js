import React from 'react';
import ReactDOMServer from 'react-dom/server';

function App() {
  return (
    <html lang="en">
      <head>
        {/* Your head content */}
      </head>
      <body>
        {/* Your body content */}
      </body>
    </html>
  );
}

const html = ReactDOMServer.renderToString(<App />);

export default html;