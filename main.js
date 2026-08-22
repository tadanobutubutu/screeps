// main.js - Main game loop entry point
module.exports = {
  loop: function() {
    // Main game loop logic
  },
  updateDependencyGraph: function() {
    const tableHeaders = document.querySelectorAll('th');
    tableHeaders.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
    // Convert the 'rotate back' anchor to a button
    const rotateBackLink = document.getElementById('unrotate');
    if (rotateBackLink) {
      rotateBackLink.outerHTML = '<button id="unrotate">rotate back</button>';
    }
  }
};