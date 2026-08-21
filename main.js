import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      {/* Single root renders the application; no duplicate <main> elements are introduced */}
      <App />
    </React.StrictMode>
  );
}