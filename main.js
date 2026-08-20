// Assuming main.js is not directly modifying the HTML, but rather importing it or referencing it.
// Below is a hypothetical example of how the main.js might reference the updated HTML.

import React from 'react';
import ReactDOM from 'react-dom';
import './docs/dependency-graph.html'; // Hypothetical import, adjust as necessary

ReactDOM.render(
  <React.StrictMode>
    {/* Other components */}
    <div id="unrotate">
      {/* Replace the anchor tag with a button */}
      <button id="unrotate" onClick={() => {/* Your action here */}}>rotate back</button>
    </div>
    {/* Other components */}
  </React.StrictMode>,
  document.getElementById('root')
);