// Hypothetical existing code from main.js
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  // Existing code and logic
  return (
    // JSX code that might be causing accessibility issues
    <div>
      <a href="/home">Home</a>
      <table>
        {/* Table content */}
      </table>
      <svg>
        {/* SVG content */}
      </svg>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));