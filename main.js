import React from 'react';
import ReactDOM from 'react-dom';

// Assuming you have a component that renders the HTML document
function App() {
  return (
    // Wrap your content in a <html> tag with the lang attribute
    <html lang="en">
      <head>
        <title>Document Title</title>
      </head>
      <body>
        {/* Your React components go here */}
      </body>
    </html>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));