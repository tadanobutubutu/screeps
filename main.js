// Before:
// <a id="unrotate" href="#">rotate back</a>

// After:
document.addEventListener('DOMContentLoaded', () => {
  const rotateBackButton = document.getElementById('unrotate');
  if (rotateBackButton) {
    rotateBackButton.addEventListener('click', (e) => {
      e.preventDefault();
      // Logic to rotate back
      console.log('Rotating back...');
      // For example, you might call a function here that actually performs the rotation
    });
  }
});