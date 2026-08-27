// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

const { renderGraphContent } = require('./graphRenderer');

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.getElementById('dependencyGraph').innerHTML = data;
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks goes here.
  // This function is to be added as per the issue report.
  const mainLandmarks = document.querySelectorAll('main');
  
  // If there are multiple main landmarks, consolidate them
  if (mainLandmarks.length > 1) {
    const primaryMain = mainLandmarks[0];
    const secondaryMains = Array.from(mainLandmarks).slice(1);
    
    // Move content from secondary mains to the primary main
    secondaryMains.forEach((main, index) => {
      const content = main.innerHTML;
      if (content.trim()) {
        // Wrap content in section with proper landmark
        const section = document.createElement('section');
        section.setAttribute('aria-labelledby', `secondary-landmark-${index}`);
        section.innerHTML = content;
        primaryMain.appendChild(section);
      }
      main.remove();
    });
  }
  
  // Ensure main landmark has proper role if missing
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach(main => {
    if (!main.hasAttribute('role')) {
      main.setAttribute('role', 'main');
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // This function is to be added as per the issue report.
  // Find all elements with href="#" or "javascript:void(0)"
  const fakeLinks = document.querySelectorAll('a[href="#"]:not([href="#"]), a[href="javascript:void(0)"]');
  
  fakeLinks.forEach(link => {
    // Add role="button" to indicate it's not a real navigation link
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    
    // Add tabindex if it's not naturally focusable
    if (!link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
    
    // Prevent default behavior while maintaining accessibility
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
  
  // Also fix links that have role="link" but shouldn't be real links
  const buttonLikeLinks = document.querySelectorAll('a[role="button"], a[role="link"]');
  buttonLikeLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === '#' || href.startsWith('javascript:')) {
      link.setAttribute('role', 'button');
      if (!link.hasAttribute('tabindex')) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
}

// Export renderDependencyGraphContent, ensureUniqueLandmarks, and fixFakeLinks functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  renderGraphContent // original export preserves for calling from another file
};