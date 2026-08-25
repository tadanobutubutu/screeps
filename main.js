// Original main.js content
// ... [Preserved code] ...

// Assuming this is the section of the code that uses the problematic <a> tag
// <a id="unrotate" href="#">rotate back</a>

// Update the <a> tag with a <button> tag
document.getElementById('unrotate').innerHTML = '<button id="unrotateButton">rotate back</button>';

// ... [Preserved code] ...

// Add the necessary event listener to the new button to perform the action without navigating
document.getElementById('unrotateButton').addEventListener('click', function() {
  // Perform the action that was intended by the original <a> tag
  // For example, rotate back to the previous state or view
});

// ... [Preserved code] ...