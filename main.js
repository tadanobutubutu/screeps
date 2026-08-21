// Main entry point for the Screeps application
import { Dashboard } from './components/Dashboard';

export default function App() {
  return <Dashboard />;
}

// HTML root setup added from origin/main
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <head>
        {/* ... (existing head elements) */}
      </head>
      <body>
        {/* ... (existing body elements) */}
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);