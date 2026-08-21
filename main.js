// main.js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Layout from './app/Layout';

ReactDOM.render(
  <React.StrictMode>
    <Layout />
  </React.StrictMode>,
  document.getElementById('root')
);

// Existing code that imports and uses the Layout component
// that includes the problematic SVG.