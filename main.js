import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// -----------------------------------------------------------------------------
// Existing code and imports are preserved exactly as they were.
// -----------------------------------------------------------------------------

const root = document.getElementById('root');

// -----------------------------------------------------------
// NEW: Wrap the primary rendered content in <main> to
// satisfy the REACT_017 accessibility rule.
// -----------------------------------------------------------
ReactDOM.render(
  <main>
    <App />
  </main>,
  root
);

// -----------------------------------------------------------------------------
// All original exports, functions, and utilities remain unchanged.
// -----------------------------------------------------------------------------
export default App;