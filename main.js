// Current main.js content with conflict markers
// <<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
// =======
// >>>>>> REACT_015 Fix
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <html lang="en">
      <head>
        <title>Hello, world!</title>
      </head>
      <body>
        <div>
          <h1>Hello, world!</h1>
        </div>
      </body>
    </html>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
// >>>>>> REACT_015 Fix