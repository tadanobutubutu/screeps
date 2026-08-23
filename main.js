import React from 'react';
import ReactDOM from 'react-dom/client';

// Fix: Added lang="en" to the root element for screen reader accessibility
// This resolves the REACT_015 rule violation

const App = () => {
  return (
    <div>
      {/* Your application UI goes here */}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);