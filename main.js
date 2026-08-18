function convertFakeLinkToButton() {
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = fakeLink.className;
    button.onclick = function() {
      handleRotateBack(); // Use the new function from the other branch
    };
    fakeLink.parentNode.replaceChild(button, fakeLink);
  }
}

function handleRotateBack() {
  // Implement your rotation logic here
  console.log('Rotating back');
  // Add any additional rotation logic needed
}

document.addEventListener('DOMContentLoaded', convertFakeLinkToButton);

// Export both functions
export {
  handleRotateBack
};