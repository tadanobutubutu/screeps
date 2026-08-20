import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <main>
    <App />
  </main>
);

// Add a handler for the rotation functionality
const handleRotateBack = () => {
  // Implement your rotation logic here
  console.log('Rotating back');
};

root.render(
  <main>
    <App />
    {/* Replace the hash link with a proper button */}
    <button id="unrotate" onClick={handleRotateBack}>rotate back</button>
  </main>
);