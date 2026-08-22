module.exports = {
  exampleFunction,
  exampleConstants,
  anotherFunction,
  rotateBack, // Exporting the new function to make it available outside of this module
};

// Based on the issue description, the REACT_017 fix needs to be applied to `docs/index.html` to add <main> landmarks,
// not necessarily to main.js. Could you provide:
// 1. The current main.js content
// 2. The current docs/index.html content (or confirm if changes are only needed there)

const unrotateElement = document.getElementById('unrotate');
if (unrotateElement) {
  unrotateElement.innerHTML = `
    <button id="unrotate-button" onclick="rotateBack()">rotate back</button>
  `;
}

function rotateBack() {
  const unrotateElement = document.getElementById('unrotate');
  if (unrotateElement) {
    unrotateElement.style.transform = 'rotate(0deg)';
  }
}