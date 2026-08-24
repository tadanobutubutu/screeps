// Original content before conflict markers
// ...

// New changes requested in the issue
function rotateBack() {
  // Implementation for rotating back
}

// Replacing the anchor tag with a button
document.getElementById('unrotate').outerHTML = `
  <button onclick="rotateBack()">rotate back</button>
`;

// Adding lang attribute to the HTML tag
document.querySelector('html').setAttribute('lang', 'en');

// ...
// Rest of the main.js content
// ...