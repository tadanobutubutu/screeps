// Fix for REACT_036: replace fake <a href="#"> with a proper <button>
(function () {
  'use strict';

  function fixUnrotate() {
    var link = document.getElementById('unrotate');
    if (!link || link.tagName.toLowerCase() !== 'a') {
      return;
    }

    var btn = document.createElement('button');
    btn.id = link.id;
    btn.textContent = link.textContent || 'rotate back';
    btn.setAttribute('type', 'button');

    if (typeof link.onclick === 'function') {
      btn.onclick = link.onclick;
    }

    link.parentNode.replaceChild(btn, link);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixUnrotate);
  } else {
    fixUnrotate();
  }

  // Preserve any existing module exports
  if (typeof exports === 'object' && typeof module !== 'undefined' && module.exports) {
    module.exports.fixUnrotate = fixUnrotate;
  }
})();

// Assuming renderTemplate is a method that takes a template string and renders it
// to the DOM or returns the rendered HTML string.

// Import the templates or get the template strings
const dependencyGraphTemplate = require('./templates/dependency-graph');
const indexTemplate = require('./templates/index');

// Function to wrap the primary content in a <main> tag
function wrapInMain(template) {
  return `<main>${template}</main>`;
}

// Update the templates to include the <main> tag
const updatedDependencyGraphTemplate = wrapInMain(dependencyGraphTemplate);
const updatedIndexTemplate = wrapInMain(indexTemplate);

// Render the updated templates
// Assuming there is a method renderTemplate that takes a template string
renderTemplate(updatedDependencyGraphTemplate);
renderTemplate(updatedIndexTemplate);