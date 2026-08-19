// Preserve existing imports
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Update ReactDOM.render with StrictMode and include the html lang attribute
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Ensure the App component wraps content in <main>
// Example layout component structure (modify as needed):
const App = () => (
  <html lang="en">
    <head>
      {/* existing head content */}
    </head>
    <body>
      <main>
        {/* Primary content */}
        <div>
          <App />
        </div>
      </main>
    </body>
  </html>
);

// Preserve existing exports and functions
export default App;