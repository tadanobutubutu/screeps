// Original main.js content
// (Assuming the contents of main.js and the conflict markers are not provided here, I will create a hypothetical example based on the given issue.)

// ... (other code)

// Existing code that uses a fake link
function rotateBack() {
  // ... (existing logic)
  // Incorrect usage of <a href="#"> which is causing the issue
  document.getElementById('unrotate').click();
}

// ... (other code)

// New code to fix the issue
function rotateBackButton() {
  // ... (existing logic)
  // Replace the fake link with a button element
  const button = document.createElement('button');
  button.id = 'unrotate-button';
  button.textContent = 'rotate back';
  button.onclick = rotateBack;
  // Append the button to the page or replace the fake link
  // ... (code to append or replace the element)
}

// ... (other code)