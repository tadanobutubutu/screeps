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

// New function to wrap content in main landmark
function wrapWithMain(content) {
  return <main>{content}</main>;
}

// Export all existing functions and add new ones
export { wrapWithMain };
// Any other existing exports or functions remain unchanged
// ...