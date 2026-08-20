// main.js

// Original code (before conflict)
// ... (code before conflict markers) ...

// Conflicting code (code between conflict markers)
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// =======
// <button id="unrotate">rotate back</button>
// >>>>>>> origin/master
// ... (code after conflict markers) ...

// Updated code with the suggested change
// ... (code before the conflicting section) ...

// Replace the <a> tag with a <button> tag
document.getElementById('unrotate').innerHTML = `
  <button id="unrotate">rotate back</button>
`;

// ... (rest of the code after the conflicting section) ...