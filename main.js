// Assuming the original `main.js` code looks something like this:
// (Please adjust the following example according to your actual code)

// Original HTML content with conflict markers (hypothetical example)
/*
======= docs/dependency-graph.html:186 =======
<a id="unrotate" href="#">rotate back</a>
>>>>>>> origin/main
*/

// Updated `main.js` to include a button with the same functionality
// (This is a JavaScript example and assumes there is a corresponding HTML update)
// The updated HTML should look like this:
/*
<a id="unrotate" href="#" style="display:none;">rotate back</a>
<button id="unrotate-button">rotate back</button>
*/

// Updated `main.js` code:
document.addEventListener('DOMContentLoaded', () => {
  // Assuming the original code had an event listener for the anchor tag
  const unrotateLink = document.getElementById('unrotate');
  const unrotateButton = document.getElementById('unrotate-button');

  // Add the event listener to the button instead of the anchor tag
  unrotateButton.addEventListener('click', () => {
    // Your existing functionality to rotate back
    // ...
  });

  // Optionally, remove the event listener from the anchor tag if it's not needed anymore
  unrotateLink.removeEventListener('click', someExistingFunction);
});

// Rest of the `main.js` code...