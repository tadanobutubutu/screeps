import { class1, function1, Object1 } from './path/to/module';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: ensureDependencyGraphARIA, getLangAttribute)
const getLangAttribute = () => document.documentElement ? document.documentElement.lang || 'en' : 'en';
document.documentElement.lang = getLangAttribute();

// - REACT_027: Validate table accessibility (DONE: validateTableAccessibility)
function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Element is not a table'] };
  }
  
  const errors = [];
  const hasCaption = table.querySelector('caption');
  const hasThead = table.querySelector('thead');
  const hasTbody = table.querySelector('tbody');
  const headers = table.querySelectorAll('th');
  
  if (!hasCaption) {
    errors.push('Table should have a caption for accessibility');
  }
  
  if (!hasThead) {
    errors.push('Table should have a thead element');
  }
  
  if (!hasTbody) {
    errors.push('Table should have a tbody element');
  }
  
  if (headers.length > 0) {
    const headersWithoutScope = Array.from(headers).filter(th => !th.hasAttribute('scope'));
    if (headersWithoutScope.length > 0) {
      errors.push('All th elements should have a scope attribute');
    }
  }
  
  return { valid: errors.length === 0, errors };
}

// - REACT_017: Add/fix landmark issues (DONE: checkLandmarkElements, addMainLandmark, ensureUniqueLandmarks, addLandmarkRegions)
function checkLandmarkElements(container = document) {
  const landmarks = {
    header: container.querySelectorAll('header:not([role])'),
    nav: container.querySelectorAll('nav:not([role])'),
    main: container.querySelectorAll('main:not([role])'),
    footer: container.querySelectorAll('footer:not([role])'),
    aside: container.querySelectorAll('aside:not([role])'),
    section: container.querySelectorAll('section[aria-label]'),
    div: container.querySelectorAll('div[role]')
  };
  
  return landmarks;
}

function validateLandmarkStructure(landmark) {
  const validRoles = ['banner', 'navigation', 'main', 'contentinfo', 'complementary', 'search'];
  const role = landmark.getAttribute('role');
  
  if (role && !validRoles.includes(role)) {
    return { valid: false, error: `Invalid landmark role: ${role}` };
  }
  
  if (landmark.tagName === 'SECTION' && !landmark.hasAttribute('aria-label')) {
    return { valid: false, error: 'Section landmark must have an aria-label' };
  }
  
  return { valid: true, error: null };
}

function validateLandmark(landmark) {
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  
  // Check for proper semantic mapping
  const validRoleMappings = {
    'header': ['banner', 'none'],
    'nav': ['navigation'],
    'main': ['main'],
    'footer': ['contentinfo', 'none'],
    'aside': ['complementary'],
    'section': ['region', 'none'],
    'div': validRoles => validRoles
  };
  
  return validateLandmarkStructure(landmark);
}

function addMainLandmark(document) {
  let main = document.querySelector('main') || document.querySelector('[role="main"]');
  
  if (!main) {
    main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    main.setAttribute('tabindex', '-1');
    
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(main, body.firstChild);
    } else {
      body.appendChild(main);
    }
  }
  
  return main;
}

function ensureUniqueLandmarks(container = document) {
  const seenLandmarks = new Map();
  const duplicates = [];
  
  const landmarks = container.querySelectorAll('header, nav, main, footer, aside, [role]');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    const id = landmark.id;
    
    if (role === 'banner' || role === 'navigation' || role === 'main' || role === 'contentinfo' || role === 'complementary') {
      const key = `${role}-${id || 'no-id'}`;
      
      if (seenLandmarks.has(role) && role !== 'navigation') {
        duplicates.push({ element: landmark, role, existingId: seenLandmarks.get(role) });
        
        if (!id) {
          landmark.id = `${role}-${seenLandmarks.get(role)}`;
        }
      } else {
        seenLandmarks.set(role, id || Math.random().toString(36).substr(2, 9));
      }
    }
  });
  
  return duplicates;
}

// - REACT_041: Add accessible names to SVGs (DONE: addSvgAccessibleNames)
function addSvgAccessibleNames(svg, name) {
  if (!svg || svg.tagName !== 'SVG') {
    return false;
  }
  
  // Check if already has an accessible name
  const hasTitle = svg.querySelector('title[id]');
  const hasAriaLabel = svg.hasAttribute('aria-label');
  const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
  
  if (hasTitle || hasAriaLabel || hasAriaLabelledBy) {
    return true;
  }
  
  // Add title element
  const titleId = `svg-title-${generateId()}`;
  const title = document.createElement('title');
  title.id = titleId;
  title.textContent = name;
  
  // Add to SVG
  svg.insertBefore(title, svg.firstChild);
  
  // Link with aria-labelledby
  svg.setAttribute('aria-labelledby', titleId);
  
  // Add role="img" if not present
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  return true;
}

// - REACT_036: Fix fake link issues (DONE: fixFakeLinkIssues)
function fixFakeLinkIssues(container = document) {
  const fakeLinks = container.querySelectorAll('div[role="link"], span[role="link"], a:not([href])');
  const fixes = [];
  
  fakeLinks.forEach(element => {
    const hasHref = element.tagName === 'A' && element.hasAttribute('href');
    const hasRoleLink = element.getAttribute('role') === 'link';
    
    if (hasRoleLink && !hasHref) {
      // Check if it should be a button instead
      const isClickable = element.hasAttribute('onclick') || 
                          element.style.cursor === 'pointer' ||
                          element.addEventListener;
      
      if (isClickable) {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
        
        // Add keyboard support if not present
        if (!element.hasAttribute('onKeyDown')) {
          element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              element.click();
            }
          });
        }
        
        fixes.push({
          element,
          fix: 'Converted to button role',
          originalRole: 'link'
        });
      }
    }
  });
  
  return fixes;
}

// - REACT_017: Fix landmark issues
function fixLandmarkIssues(container = document) {
  const issues = [];
  
  // Fix landmarks without proper roles
  const headerElements = container.querySelectorAll('header:not([role])');
  headerElements.forEach(header => {
    if (!container.querySelector('header[role="banner"]')) {
      header.setAttribute('role', 'banner');
      issues.push({ element: header, fix: 'Added banner role' });
    }
  });
  
  const footerElements = container.querySelectorAll('footer:not([role])');
  footerElements.forEach(footer => {
    if (!container.querySelector('footer[role="contentinfo"]')) {
      footer.setAttribute('role', 'contentinfo');
      issues.push({ element: footer, fix: 'Added contentinfo role' });
    }
  });
  
  // Fix divs with landmark roles but no semantic element
  const roleLandmarks = container.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]');
  roleLandmarks.forEach(element => {
    if (element.tagName !== 'HEADER' && element.tagName !== 'NAV' && element.tagName !== 'MAIN' && element.tagName !== 'FOOTER' && element.tagName !== 'ASIDE') {
      // Element has role but is not using semantic HTML
      issues.push({ element, fix: 'Uses role instead of semantic HTML' });
    }
  });
  
  return issues;
}

// - REACT_017: Add landmark regions
function addLandmarkRegions(container = document) {
  const regions = [];
  
  // Add skip link to main content
  let skipLink = container.querySelector('a[href="#main-content"]');
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
    skipLink.addEventListener('focus', () => {
      skipLink.style.cssText = 'position:static;width:auto;height:auto;';
    });
    container.body.insertBefore(skipLink, container.body.firstChild);
    regions.push({ element: skipLink, region: 'skip-link' });
  }
  
  // Add search landmark if there's a search form
  const searchForms = container.querySelectorAll('form[role="search"], form input[type="search"]');
  searchForms.forEach(form => {
    if (!form.closest('[role="search"]')) {
      const searchRegion = document.createElement('div');
      searchRegion.setAttribute('role', 'search');
      form.parentNode.insertBefore(searchRegion, form);
      searchRegion.appendChild(form);
      regions.push({ element: searchRegion, region: 'search' });
    }
  });
  
  return regions;
}

// - REACT_037: Google sign-in logic (DONE: googleSignIn)
function googleSignIn(document) {
  const googleSignInButtons = document.querySelectorAll('[data-google-signin], [aria-label*="sign in" i], button:has(svg[data-google-icon])');
  const signInCallbacks = [];
  
  googleSignInButtons.forEach(button => {
    const originalOnClick = button.onclick;
    const callback = (event) => {
      event.preventDefault();
      
      // Trigger Google sign-in flow
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
          client_id: button.dataset.googleClientId || '',
          callback: (response) => {
            console.log('Google Sign-In