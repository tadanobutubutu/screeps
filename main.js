// Assuming main.js is responsible for rendering the HTML content of the application,
// and the conflict markers are indicating a merge conflict from previous changes.

// Original code with conflict markers:
// <<<<<<< HEAD
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';
// 
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// >>>>>>> origin/main
// 
// <<<<<<< HEAD
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';
// 
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// >>>>>>> origin/main

// Updated code with the addition of the lang attribute to the root element
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);