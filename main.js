document.addEventListener('DOMContentLoaded', (event) => {
  const htmlTag = document.documentElement;
  if (!htmlTag.lang) {
    htmlTag.setAttribute('lang', 'en');
  }

  // Update the 'rotate back' link to use a button instead
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Remove the anchor element
    rotateBackLink.parentNode.removeChild(rotateBackLink);

    // Create a new button element
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.onclick = () => {
      // Assuming there's a function to handle the rotate back action
      rotateBack();
    };

    // Insert the button into the DOM
    rotateBackLink.parentNode.appendChild(rotateBackButton);
  }
});

// Placeholder for the rotateBack function, which should be defined elsewhere in the codebase
function rotateBack() {
  // Rotate back implementation
}