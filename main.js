// Assuming the use of React to render the HTML
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Dependency Graph</title>
        {/* Other head elements */}
      </head>
      <body>
        <div id="root">
          {/* The rest of your app's content */}
        </div>
        {/* Other body elements */}
      </body>
    </html>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));