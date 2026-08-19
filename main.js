// Assuming the following conflict markers are present in your main.js file:
// <<<<<<< HEAD
// <a id="unrotate" href="#">rotate back</a>
// =======
// <button id="unrotate">rotate back</button>
// >>>>>>> branch-name

// Here is how you might refactor the code in main.js to use a button:
// Preserve the existing code and add the new button functionality.

// Your original main.js content before the conflict markers
// ... (existing code)

// Refactoring to use a button
document.addEventListener('DOMContentLoaded', () => {
  const unrotateButton = document.getElementById('unrotate');
  
  // Assuming you have a function to handle the rotate back action
  const rotateBackAction = () => {
    // Your logic to rotate back
  };

  // Attach the rotate back action to the button click event
  unrotateButton.addEventListener('click', rotateBackAction);
});

// ... (rest of your main.js code)