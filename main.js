// main.js

// Existing code that needs to be preserved
// <<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// =======
// Changes requested in the issue to add accessible names to SVG elements
import { Layout } from './Layout';

ReactDOM.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
  document.getElementById('root')
);

// >>>>>>> feature/add-accessible-names-to-svg