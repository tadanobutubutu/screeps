// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function() {
      // Rotate back functionality
      document.body.style.transform = 'rotate(0deg)';
    });
  }

  // Adding accessibility to SVGs
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.querySelector('title') && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
});