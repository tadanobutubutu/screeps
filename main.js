export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

// Assuming the `main.js` file is structured in a way that you can replace the conflicting lines
// with the following code. You'll need to find the exact locations of the conflicting lines
// and replace them accordingly.

// Current main.js content
// (Assuming this is the existing content with conflict markers)

// <<<<<<< HEAD
// Original code that uses a fake link
function rotateBack() {
  // ... existing logic ...
  document.getElementById('unrotate').click();
}

// ========

// New code to replace the fake link with a button
function rotateBack() {
  // ... existing logic ...
  document.getElementById('rotateBackButton').click();
}

// >>>>>>> origin/main