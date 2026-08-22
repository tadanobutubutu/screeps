// main.js

// Existing code that needs to be preserved
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Layout } from './Layout';

// Wrap the primary content in <main> to comply with the REACT_017 rule
ReactDOM.render(
  <React.StrictMode>
    <main>
      <Layout />
    </main>
  </React.StrictMode>,
  document.getElementById('root')
);