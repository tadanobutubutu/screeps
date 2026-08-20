// Assuming the following is the content of main.js or a part of it that includes the dependency-graph.html
import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // This is a hypothetical import for illustration purposes

ReactDOM.render(
  <React.StrictMode>
    {/* ... other components ... */}
    <div id="app">
      {/* ... other content ... */}
      <a id="unrotate" href="#">rotate back</a> {/* This line is replaced with the following */}
      <button id="unrotate" onClick={() => {/* Handle the rotate back action here */}}>rotate back</button>
      {/* ... other content ... */}
    </div>
    {/* ... other components ... */}
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of main.js ...