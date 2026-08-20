// Import any necessary dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// Existing code and functions (only update the problematic line)
const rotateBackBtn = (
  <button id="unrotate">rotate back</button>
); // Replace the <a> tag with a <button> tag as shown above

// Mount the component to the specified container in the HTML file
ReactDOM.render(rotateBackBtn, document.getElementById('unrotate'));

// Existing exports
export default rotateBackBtn;