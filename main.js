// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  const unrotateBtn = document.getElementById('unrotate');
  
  if (unrotateBtn) {
    unrotateBtn.addEventListener('click', function() {
      // Rotate back functionality
      document.body.style.transform = 'rotate(0deg)';
    });
  }

  // Wrap the primary content in <main> to satisfy the REACT_017 rule
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(mainContent);
    mainContent.parentNode.replaceChild(mainElement, mainContent);
  }
});