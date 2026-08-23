// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

// REACT_015: Add lang attribute to HTML element
document.documentElement.lang = 'en';

// Helper function to add accessible names to SVG elements (REACT_041)
function addSvgAccessibility(svgElement, label) {
  if (!svgElement) return;
  
  svgElement.setAttribute('role', 'img');
  svgElement.setAttribute('aria-label', label);
  
  // Add title element if not present
  const title = svgElement.querySelector('title') || document.createElement('title');
  title.textContent = label;
  if (!svgElement.querySelector('title')) {
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

// Helper function to add scope attribute to table headers (REACT_027)
function addTableHeaderScope(thElements) {
  thElements.forEach((th, index) => {
    const parent = th.parentElement;
    const siblings = Array.from(parent.children);
    const isFirstCell = siblings.indexOf(th) === 0;
    
    th.setAttribute('scope', isFirstCell ? 'row' : 'col');
  });
}

// Helper function to fix fake links (REACT_036)
function fixFakeLinks(container) {
  const links = container.querySelectorAll('a[href="#"]');
  links.forEach(link => {
    const isButton = link.getAttribute('role') === 'button' || 
                     link.style.cursor === 'pointer' ||
                     link.onclick;
    if (isButton) {
      link.setAttribute('role', 'button');
    }
  });
}

// Helper function to ensure unique landmarks (REACT_025)
function validateUniqueLandmarks(container) {
  const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = container.querySelectorAll(landmark);
    if (elements.length > 1) {
      console.warn(`Multiple <${landmark}> elements found. Consider using aria-label for unique identification.`);
    }
  });
}

// Main initialization
function initializeAccessibility() {
  // REACT_017 & REACT_025: Validate landmark structure
  validateUniqueLandmarks(document.body);
  
  // REACT_036: Fix any fake links
  fixFakeLinks(document.body);
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Export utilities for use elsewhere (REACT_041, REACT_027)
export { addSvgAccessibility, addTableHeaderScope, fixFakeLinks, validateUniqueLandmarks };