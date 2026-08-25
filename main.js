// Preserve existing code, exports, and functions

// Add the new button to replace the existing link
const rotateBackLink = () => {
  // Add your existing rotateBackLink function here
};

// Replace the existing link with the new button
// Assuming that your original link was in a div with id "rotate-buttons"
document.querySelector(`#rotate-buttons #unrotate`).innerHTML = `
  <button id="unrotate" onClick={rotateBackLink}>
    rotate back
  </button>
`;