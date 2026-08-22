import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        <main>
          <App />
        </main>
        {/* Add a landmark for the main content */}
        <nav id="skip-link">
          <a href="#content" className="skip-link">Skip to content</a>
        </nav>
        <div id="content">
          {/* Existing content */}
        </div>
      </body>
    </html>
  </React.StrictMode>,
  document.getElementById('root')
);