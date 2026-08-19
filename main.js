// Assuming main.js is a React application entry point and it imports the HTML file
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // This is the file that is causing the issue

function App() {
  return (
    <div>
      {/* ... other components ... */}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));