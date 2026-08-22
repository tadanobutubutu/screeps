// main.js

import React from 'react';
import ReactDOM from 'react-dom';

// Assuming Dashboard is the component that has the issue
import Dashboard from './components/Dashboard';

const App = () => {
  // ... other code ...

  return (
    <div>
      {/* Existing code */}
      <Dashboard />
      {/* ... other code */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));