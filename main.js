// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function() {
      // Rotate back functionality
      document.body.style.transform = 'rotate(0deg)';
    });
  }
});