// Show/hide the rotate back button based on whether content is rotated
function updateUnrotateVisibility() {
  const unrotateBtn = document.getElementById('unrotate');
  if (unrotateBtn) {
    const isRotated = document.body.classList.contains('is-rotated');
    unrotateBtn.style.display = isRotated ? '' : 'none';
  }
}

// Rotate the content
function rotateContent() {
  document.body.classList.add('is-rotated');
  updateUnrotateVisibility();
}

// Rotate back to original state
function unrotateContent() {
  document.body.classList.remove('is-rotated');
  updateUnrotateVisibility();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  const rotateBtn = document.getElementById('rotate');
  const unrotateBtn = document.getElementById('unrotate');
  
  if (rotateBtn) {
    rotateBtn.addEventListener('click', rotateContent);
  }
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', unrotateContent);
  }
  
  updateUnrotateVisibility();
});