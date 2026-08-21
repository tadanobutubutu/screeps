// Existing code from main.js
import React from 'react';
import ReactDOM from 'react-dom';

// ... (other imports and code)

function App() {
  // ... (existing App component code)
}

ReactDOM.render(<App />, document.getElementById('root'));

// ... (other existing code)

// New code to fix the issue with the lang attribute
document.documentElement.lang = 'en';