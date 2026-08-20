// Sample main.js - Replace with actual file content
document.addEventListener('DOMContentLoaded', function() {
  const unrotateButton = document.getElementById('unrotate');
  if (unrotateButton) {
    unrotateButton.addEventListener('click', function(e) {
      e.preventDefault();
      // Add your rotate back logic here
      document.body.style.transform = 'rotate(0deg)';
    });
  }
});