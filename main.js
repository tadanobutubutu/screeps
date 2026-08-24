// Original main.js content (hypothetical, as the actual content is not provided)
// <a id="unrotate" href="#">rotate back</a>

// Updated main.js content
// Replace the anchor tag with a button and ensure it has the appropriate functionality

const rotateBack = () => {
  // Existing logic for rotating back, if any
  console.log('Rotating back...');
};

document.addEventListener('DOMContentLoaded', () => {
  // Assuming there was a click event listener for the anchor tag before
  // Now we need to add the event listener for the button
  const unrotateButton = document.getElementById('unrotate');
  unrotateButton.addEventListener('click', rotateBack);
});