// Assuming the conflict markers are related to the root HTML element, here's how you might resolve the issue in the main.js file.

// Current main.js content (with conflict markers):
// <<<<<<< HEAD
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// reportWebVitals();
// =======
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// ReactDOM.render(
//   <React.StrictMode>
//     <html lang="en">
//       <App />
//     </html>
//   </React.StrictMode>,
//   document.getElementById('root')
// );
// reportWebVitals();
// >>>>>>> origin/main
// );

// Updated main.js content:
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <App />
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();