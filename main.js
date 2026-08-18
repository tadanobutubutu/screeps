// main.js

// Original content with conflict markers:
// <<<<<<< HEAD
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// =======
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(
//   <React.StrictMode>
//     <main>
//       <App />
//     </main>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// >>>>>>> origin/main

// Updated content without conflict markers:
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);