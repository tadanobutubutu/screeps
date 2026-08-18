import React from 'react';
import ReactDOM from 'react-dom/client';

// Main application entry point
function App() {
  return (
    <div>
      <h1>Application Root</h1>
    </div>
  );
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error('No root element found. Please add <div id="root"></div> to your HTML.');
}