// Existing code (preserved as-is)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add main landmark to layout components
const RootLayout = ({ children }) => (
  <main className="flex-1">
    {children}
  </main>
);

// Update the main rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RootLayout>
      <App />
    </RootLayout>
  </React.StrictMode>
);

// Preserve any existing exports
export { RootLayout };