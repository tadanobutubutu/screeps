/**
 * Accessibility utilities for addressing insight report issues
 */

// REACT_015: Add lang attribute to HTML element
function addLangToHtml(htmlString, lang = 'en') {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const html = doc.documentElement;
  
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', lang);
  }
  
  return doc.documentElement.outerHTML;
}

// REACT_017: Add landmark roles and fix landmark issues
function addLandmarkRoles(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  // Add main landmark
  const mains = doc.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    // No main element found, create one wrapping main content
    const body = doc.querySelector('body');
    if (body) {
      const mainEl = doc.createElement('main');
      mainEl.setAttribute('role', 'main');
      while (body.firstChild) {
        mainEl.appendChild(body.firstChild);
      }
      body.appendChild(mainEl);
    }
  } else {
    // Ensure main has proper role
    mains.forEach(main => {
      if (!main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
      }
    });
  }
  
  // Add navigation landmarks with aria-label
  const navs = doc.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  // Add header landmark
  const headers = doc.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  });
  
  // Add footer landmark
  const footers = doc.querySelectorAll('footer');
  footers.forEach(footer => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  });
  
  return doc.documentElement.outerHTML;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const svgs = doc.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.querySelector('title')) {
      const title = doc.createElement('title');
      title.textContent = `SVG icon ${index + 1}`;
      title.setAttribute('id', `svg-title-${index + 1}`);
      
      // Insert title as first child
      if (svg.firstChild) {
        svg.insertBefore(title, svg.firstChild);
      } else {
        svg.appendChild(title);
      }
      
      svg.setAttribute('aria-labelledby', `svg-title-${index + 1}`);
    }
  });
  
  return doc.documentElement.outerHTML;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const landmarks = {
    header: doc.querySelectorAll('header, [role="banner"]'),
    nav: doc.querySelectorAll('nav, [role="navigation"]'),
    main: doc.querySelectorAll('main, [role="main"]'),
    footer: doc.querySelectorAll('footer, [role="contentinfo"]'),
    aside: doc.querySelectorAll('aside, [role="complementary"]'),
    section: doc.querySelectorAll('section, [role="region"]')
  };
  
  let counter = 1;
  
  Object.keys(landmarks).forEach(landmarkType => {
    const elements = landmarks[landmarkType];
    elements.forEach(el => {
      const existingLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
      if (!existingLabel) {
        if (elements.length > 1) {
          el.setAttribute('aria-label', `${landmarkType} ${counter}`);
          counter++;
        }
      }
    });
    counter = 1; // Reset for each landmark type
  });
  
  return doc.documentElement.outerHTML;
}

// REACT_036: Fix fake link issues (links without proper href)
function fixFakeLinks(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const links = doc.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const onclick = link.getAttribute('onclick');
    const role = link.getAttribute('role');
    
    // Check for fake links: no href but has click handler, or href="#"
    const isFakeLink = (!href || href === '#') && onclick;
    
    if (isFakeLink && !role) {
      // Either add proper href or convert to button
      link.setAttribute('role', 'button');
      
      // If no href, add a meaningful href or keep as button
      if (!href || href === '#') {
        link.setAttribute('href', '#' + (link.textContent.toLowerCase().replace(/\s+/g, '-') || 'link'));
      }
    }
  });
  
  // Also check for elements with role="link" that aren't <a> tags
  const fakeLinkSelectors = '[role="link"]:not(a)';
  doc.querySelectorAll(fakeLinkSelectors).forEach(el => {
    el.setAttribute('role', 'button');
  });
  
  return doc.documentElement.outerHTML;
}

// REACT_027: Add scope to th elements (as mentioned in issue as already implemented)
function addScopeToThElements(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  const thElements = doc.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if this is a column header or row header
      const parent = th.parentElement;
      const isRowHeader = parent && parent.querySelector('th') === th && 
                          Array.from(parent.children).indexOf(th) > 0;
      
      if (isRowHeader) {
        th.setAttribute('scope', 'row');
      } else {
        th.setAttribute('scope', 'col');
      }
    }
  });
  
  return doc.documentElement.outerHTML;
}

// Master function to apply all accessibility fixes
function applyAccessibilityFixes(htmlString, options = {}) {
  const {
    lang = 'en',
    svgNames = true,
    uniqueLandmarks = true,
    fakeLinks = true,
    scopeAttrs = true
  } = options;
  
  let result = htmlString;
  
  // Always apply lang attribute
  result = addLangToHtml(result, lang);
  
  // Add landmark roles
  result = addLandmarkRoles(result);
  
  // Apply optional fixes
  if (svgNames) {
    result = addSvgAccessibleNames(result);
  }
  
  if (uniqueLandmarks) {
    result = ensureUniqueLandmarks(result);
  }
  
  if (fakeLinks) {
    result = fixFakeLinks(result);
  }
  
  if (scopeAttrs) {
    result = addScopeToThElements(result);
  }
  
  return result;
}

module.exports = {
  addLangToHtml,
  addLandmarkRoles,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  addScopeToThElements,
  applyAccessibilityFixes
};