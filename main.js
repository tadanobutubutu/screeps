// Original main.js content (not including conflict markers)

// ... (existing code)

// The problematic link
// <a id="unrotate" href="#">rotate back</a>

// ... (existing code)

// Updated main.js content

// ... (existing code)

// Replace the problematic <a> tag with a <button> tag
// <button id="unrotate">rotate back</button>

// ... (existing code)

// Ensure that the new button behaves correctly for keyboard and screen reader users
document.getElementById('unrotate').addEventListener('click', function() {
  // ... (the logic to rotate back)
});

// ... (existing code)

// ... (remaining code from main.js)