// TODO: Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role

const { renderGraphContent } = require('./graphRenderer');

// Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  const container = document.getElementById('dependencyGraph');
  if (container) {
    container.innerHTML = data;
    
    // Adding landmark for main content
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks goes here.
  // This function is to be added as per the issue report.
  const landmarks = document.querySelectorAll('[role="main"], main');
  const seen = new Set();
  
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if (seen.has(tagName)) {
      landmark.removeAttribute('role');
    } else {
      seen.add(tagName);
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  // Implementation for fixing fake link issues goes here.
  // This function is to be added as per the issue report.
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  
  fakeLinks.forEach(link => {
    link.setAttribute('tabindex', '0');
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });
}

// Add proper landmark regions (REACT_037)
function addProperLandmarkRegions() {
  // Add proper landmark regions to the page for accessibility
  // This function ensures all content areas have appropriate landmark roles
  
  // Ensure main landmark exists
  let mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!mainElement) {
    mainElement = document.createElement('main');
    const contentArea = document.getElementById('content') || document.body;
    contentArea.insertBefore(mainElement, contentArea.firstChild);
  }
  
  // Ensure navigation landmark
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Ensure header has banner landmark if appropriate
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
  
  // Ensure footer has contentinfo landmark if appropriate
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  
  // Ensure aside has complementary landmark
  const asides = document.querySelectorAll('aside');
  asides.forEach(aside => {
    if (!aside.getAttribute('role') || aside.getAttribute('role') !== 'complementary') {
      aside.setAttribute('role', 'complementary');
    }
  });
  
  return {
    main: mainElement,
    navCount: navElements.length,
    header: header,
    footer: footer,
    asideCount: asides.length
  };
}

// Export renderDependencyGraphContent, ensureUniqueLandmarks, and fixFakeLinks functions
module.exports = {
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  addProperLandmarkRegions,
  renderGraphContent // original export preserves for calling from another file
};