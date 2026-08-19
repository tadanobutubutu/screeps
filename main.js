// main.js
// [Your existing code here...]

// Replace the problematic link with a proper button
document.addEventListener('DOMContentLoaded', function() {
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = rotateBackLink.className;
    button.addEventListener('click', function() {
      // Add your rotation logic here
      console.log('Rotation triggered');
    });

    rotateBackLink.parentNode.replaceChild(button, rotateBackLink);
  }
});

// [Rest of your existing code...]