// main.js
// [Your existing code remains unchanged]

// Add these new functions to handle SVG accessibility
function setupSVGAccessibility(svg) {
  if (svg && svg.getAttribute('role') === 'img') {
    const title = svg.querySelector('title') || svg.getAttribute('aria-label');
    if (!title && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-label', 'Application icon');
    }
  }
}

// Initialize accessibility for all SVGs
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    setupSVGAccessibility(svg);
  });
  
  // Replace the fake link with a proper accessible button
  const unrotateLink = document.getElementById('unrotate');
  if (unrotateLink && unrotateLink.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.type = 'button';
    button.textContent = unrotateLink.textContent;
    
    // Copy any existing event listeners or attributes if needed
    if (unrotateLink.className) button.className = unrotateLink.className;
    if (unrotateLink.onclick) button.onclick = unrotateLink.onclick;
    
    unrotateLink.parentNode.replaceChild(button, unrotateLink);
  }
});

// [Rest of your existing code remains unchanged]