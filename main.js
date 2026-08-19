// Existing code...
// ... (code up to line 185)

// Replace the anchor tag with a button tag
const link = document.getElementById('unrotate');
if (link) {
  // Create a new button element
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.onclick = link.onclick; // Preserve the original onclick behavior

  // Replace the anchor with the button
  link.parentNode.replaceChild(button, link);
}

// ... (rest of the code)