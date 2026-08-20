// Existing code from main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Example component (assuming this is where the <html> tag is being used)
const App = () => {
  return (
    <html>
      <head>
        <title>My App</title>
      </head>
      <body>
        <div className="app-container">
          {/* App content */}
        </div>
      </body>
    </html>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));