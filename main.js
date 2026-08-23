// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');

  if (unrotateBtn) {
    // Rotate back functionality
    unrotateBtn.addEventListener('click', function() {
      // Rotate back functionality
      document.body.style.transform = 'rotate(0deg)';
    });

    // Accessibility: provide an ARIA label for screen readers
    unrotateBtn.setAttribute('aria-label', 'Rotate page back');
  }
});