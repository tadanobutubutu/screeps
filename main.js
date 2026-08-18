// Preserving existing main.js code structure and exports
// Conflict resolution: Adding <main> landmark while preserving existing logic

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Layout from './Layout'; // Assuming existing layout component

// Conflict resolution section
// Original code (maintained):
// <<<<<<< HEAD
// ...existing code without <main>...
// =======
// ...code from other branch with <main>...
// >>>>>>> some-branch

// Updated code with <main> landmark
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <main> {/* Primary content wrapped in <main> */ <App /> </main>
);

// Preserved exports and functions
export default App;
export { Layout }; // Keep existing exports