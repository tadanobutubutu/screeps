// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// REACT_017 & REACT_025: Add/fix landmark issues and ensure unique landmarks
function fixLandmarks() {
  // Ensure main landmark exists with a unique accessible name
  let mainEl = document.querySelector('main');
  if (!mainEl) {
    mainEl = document.querySelector('#main, #content, #app');
    if (mainEl) {
      mainEl.setAttribute('role', 'main');
    }
  }
  if (mainEl && !mainEl.getAttribute('aria-label')) {
    mainEl.setAttribute('aria-label', 'Main content');
  }

  // Ensure navigation landmarks are unique
  const navElements = document.querySelectorAll('nav, [role="navigation"]');
  navElements.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : 'Secondary navigation');
    }
  });

  // Ensure header/banner landmark exists
  const headerEl = document.querySelector('header');
  if (headerEl && !headerEl.getAttribute('role')) {
    headerEl.setAttribute('role', 'banner');
  }

  // Ensure footer/contentinfo landmark exists
  const footerEl = document.querySelector('footer');
  if (footerEl && !footerEl.getAttribute('role')) {
    footerEl.setAttribute('role', 'contentinfo');
  }
}

// REACT_041: Add accessible names to 2 SVGs
function fixSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasLabel = svg.getAttribute('aria-label') ||
                     svg.getAttribute('aria-labelledby') ||
                     svg.querySelector('title');
    if (!hasLabel) {
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = svg.getAttribute('data-name') || `Graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', title.textContent);
    }
  });
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks() {
  const links = document.querySelectorAll('a[href="#"], a:not([href])');
  links.forEach((link) => {
    // If the link has an onclick handler but no real href, convert to button
    if (link.getAttribute('onclick') && (!link.getAttribute('href') || link.getAttribute('href') === '#')) {
      const button = document.createElement('button');
      button.innerHTML = link.innerHTML;
      button.className = link.className;
      button.id = link.id;
      if (link.getAttribute('onclick')) {
        button.setAttribute('onclick', link.getAttribute('onclick'));
      }
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Apply all accessibility fixes
function applyAccessibilityFixes() {
  fixLandmarks();
  fixSvgAccessibility();
  fixFakeLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyAccessibilityFixes);
} else {
  applyAccessibilityFixes();
}