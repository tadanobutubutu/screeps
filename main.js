// main.js
import React from 'react';

// For app/layout.tsx
const AppLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => {
  return (
    <React.StrictMode>
      <main lang="en" role="main">
        {children}
      </main>
    </React.StrictMode>
  );
};

// New function to handle the rotation action
const handleRotation = (e) => {
  e.preventDefault();
  // Add your rotation logic here
  console.log('Rotation triggered');
};

// Replace the fake link with a proper button
const RotationButton = () => (
  <button
    id="unrotate"
    onClick={handleRotation}
    aria-label="Rotate back"
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      font: 'inherit',
      cursor: 'pointer',
      color: 'inherit',
      textDecoration: 'underline'
    }}
  >
    rotate back
  </button>
);

// Main rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all existing functions if any
// (Preserve any existing exports from the original file)
export { AppLayout, DashboardLayout, RotationButton };