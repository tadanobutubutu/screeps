// Assuming main.js contains a React component that renders the HTML document
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
      </head>
      <body>
        {/* Other content of the body */}
      </body>
    </html>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));