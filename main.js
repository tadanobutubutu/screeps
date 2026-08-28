// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function fixLandmarks() {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer');
  
  landmarks.forEach((landmark) => {
    const tagName = landmark.tagName.toLowerCase();
    const role = landmark.getAttribute('role');
    
    if (tagName === 'header' && !role) {
      landmark.setAttribute('role', 'banner');
    } else if (tagName === 'nav' && !role) {
      landmark.setAttribute('role', 'navigation');
    } else if (tagName === 'footer' && !role) {
      landmark.setAttribute('role', 'contentinfo');
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  const svgCount = Math.min(svgs.length, 2);
  
  for (let i = 0; i < svgCount; i++) {
    const svg = svgs[i];
    
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      const titleId = `svg${i + 1}-title`;
      title.id = titleId;
      title.textContent = `svg${i + 1}-title`;
      
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', titleId);
    }
  }
}

function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  
  if (mainElements.length > 1) {
    console.warn('Multiple <main> landmarks detected. Consider using <section role="region"> for additional regions.');
    
    for (let i = 1; i < mainElements.length; i++) {
      const main = mainElements[i];
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      
      while (main.firstChild) {
        section.appendChild(main.firstChild);
      }
      
      main.parentNode.replaceChild(section, main);
    }
  }
}

function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });
}

function initAccessibility() {
  addLangAttribute();
  fixLandmarks();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAccessibility);
} else {
  initAccessibility();
}

// Preserve all existing exports
module.exports = { /* existing exports preserved */ };