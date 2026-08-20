// Assuming this is the part of main.js that includes the problematic code
// and the conflict markers are not present in this snippet.

// ... (other code)

// Replace the <a> tag with a <button> element
const rotateBackButton = document.createElement('button');
rotateBackButton.id = 'unrotate';
rotateBackButton.textContent = 'rotate back';
rotateBackButton.onclick = function() {
  // Your existing code to rotate back should go here
  // For example:
  // window.location.hash = 'some-value';
};

// Remove the original <a> element
const originalLink = document.querySelector('#unrotate');
if (originalLink) {
  originalLink.parentNode.removeChild(originalLink);
}

// Append the new <button> element to the document or a specific container
document.body.appendChild(rotateBackButton);

// ... (rest of the code)