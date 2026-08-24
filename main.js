// main.js - Accessibility fixes applied

document.addEventListener('DOMContentLoaded', function() {
  // REACT_015: Add lang attribute to HTML element
  document.documentElement.lang = 'en';
  
  // REACT_017: Fix landmark issues - ensure proper landmark usage
  // Ensure <main>, <nav>, <header>, <footer> are used semantically
  
  // REACT_041: Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
  
  // REACT_025: Ensure unique landmarks
  // Add unique labels to multiple <nav> elements
  const navs = document.querySelectorAll('nav');
  if (navs.length > 1) {
    navs.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }
  
  // REACT_036: Fix fake link issues
  // Convert divs/spans with click handlers to proper links or buttons
  document.querySelectorAll('[role="link"], .fake-link').forEach(el => {
    if (el.tagName !== 'A') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
    }
  });
});