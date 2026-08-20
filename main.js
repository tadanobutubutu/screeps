// Placeholder for the existing code that has conflict markers
// <<<<<<< HEAD
// ... (conflicting code) ...
// =======
// ... (conflicting code) ...
// >>>>>>> branch-name

// New function or change requested to replace the anchor tag
function rotateBackButton() {
  // ... (any additional logic you might need here) ...

  // Create a button element instead of an anchor
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.onclick = function() {
    // ... (any action to perform on click) ...
  };

  // Replace the anchor with the button
  const anchor = document.querySelector('a#unrotate');
  anchor.parentNode.replaceChild(button, anchor);
}

// Call the function to update the DOM
rotateBackButton();