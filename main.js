// Main entry point for the application
import React from 'react';
import ReactDOM from 'react-dom/client';

// Application root rendering
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Default export for the application
export default App;

// Example component placeholder
const App = () => {
  return (
    <div>
      <h1>Welcome to Screeps</h1>
    </div>
  );
};