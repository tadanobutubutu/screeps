/** main.js - React application entry point */
/** REACT_017 fix: Wrap primary content in <main> landmark for accessibility */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);

export { root };