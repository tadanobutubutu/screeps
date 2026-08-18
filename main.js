// Current main.js content
// ...

// Assuming the conflict markers are as follows, with the problematic line:
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// =======
// <button id="unrotate">rotate back</button>
// >>>>>>> branch-name
// ...

// Updated main.js content
// Preserve all existing code
// ...

// Add the new function or change requested in the issue
// Replace the problematic line with a button element
const unrotateButton = document.createElement('button');
unrotateButton.id = 'unrotate';
unrotateButton.textContent = 'rotate back';
document.body.appendChild(unrotateButton);

// Preserve all existing code, exports, and functions
// ...

// Output the complete updated main.js content inside a