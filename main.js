import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add a wrapper component to ensure only one main element
function MainWrapper({ children }) {
  return (
    <div className="app-container">
      <main>
        {children}
      </main>
    </div>
  );
}

// Update the root render to use the wrapper
root.render(
  <React.StrictMode>
    <MainWrapper>
      <App />
    </MainWrapper>
  </React.StrictMode>
);