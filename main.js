import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Here we have two versions of the App import. Let's assume version HEAD contains the newest or required version.
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Borrow the render logic from the non-conflicted version
root.render(
  <React.StrictMode>
    <main>
      <App />
    </main>
  </React.StrictMode>
);