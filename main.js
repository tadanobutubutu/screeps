import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div id="root">
      <h1>My Application</h1>
      {/* Placeholder for table content */}
      <p>Table content would be rendered here.</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);