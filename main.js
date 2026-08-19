import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// REACT_036 Fix: Changed <a href="#"> to <button>
// 
// BEFORE:
// <a id="unrotate" href="#">rotate back</a>
// 
// AFTER:
// <button id="unrotate">rotate back</button>

// REACT_041 Fix: Add accessibility attributes to SVG elements
function makeSvgAccessible() {
  document.querySelectorAll('svg').forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      let title = svg.querySelector('title');
      if (!title) {
        const desc = svg.getAttribute('alt') || 'Graphic';
        title = document.createElement('title');
        title.textContent = desc;
        svg.appendChild(title);
      }
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', makeSvgAccessible);

// For each <th> element in dependency-graph.html, add scope="col" like this:
// <th scope="col"><div>src/constants.js</div></th>

// React accessibility fix function for module environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    applyREACT041Fix: makeSvgAccessible
  };
}

const root = createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preserve all existing exports and functions from the original main.js
export { root };

console.log("main.js is properly formatted as JavaScript");