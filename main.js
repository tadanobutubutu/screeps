/** @jsxImportSource react */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

// REACT_036 fix: Replaced hash-only link with proper button for in-page actions
const RotateBackButton = () => {
  const handleRotateBack = () => {
    // Add your rotation logic here
    console.log('Rotating back');
  };

  return (
    <button id="unrotate" onClick={handleRotateBack}>
      rotate back
    </button>
  );
};

// REACT_017 fix: Wrapped primary content in <main> landmark for screen reader accessibility
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <main>
      <App />
      <RotateBackButton />
    </main>
  </React.StrictMode>
)