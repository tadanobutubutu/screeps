// Original content of main.js before conflict markers
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function App() {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>This is a paragraph.</p>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// Content with conflict markers
<<<<<<< HEAD
// This is the code that was in the branch before merging
// More content here...
=======
// This is the code that was in the main branch
// More content here...
>>>>>>> origin/main