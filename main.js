// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Existing code (preserved as-is)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to wrap content in main landmark
function wrapInMain(content) {
  return <main>{content}</main>;
}

// Export all existing functions (preserved as-is)
export { wrapInMain };

// Example usage (you can remove this if not needed)
function ExampleComponent() {
  return wrapInMain(
    <div>
      <h1>Welcome to My App</h1>
      <p>This content is now properly wrapped in a main landmark.</p>
    </div>
  );
}

// Export any other existing exports (preserved as-is)
export default App;