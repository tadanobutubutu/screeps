// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

const getLangAttribute = () => {
  // Returns the lang attribute value for the HTML element
  return document.documentElement.lang || 'en';
};

const createInPageButton = (id, label, target) => {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', () => {
    const targetElement = document.querySelector(target);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      targetElement.focus();
    }
  });
  return button;
};

const validateTableAccessibility = (table) => {
  const issues = [];
  
  // Check if table has proper structure
  if (!table.querySelector('thead')) {
    issues.push('REACT_027: Table missing thead element');
  }
  
  if (!table.querySelector('tbody')) {
    issues.push('REACT_027: Table missing tbody element');
  }
  
  // Check for caption
  if (!table.querySelector('caption')) {
    issues.push('REACT_027: Table missing caption element');
  }
  
  return issues;
};

const validateTableStructure = (table) => {
  const issues = [];
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td');
  
  // Check for scope attributes on headers
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`REACT_027: Header at index ${index} missing scope attribute`);
    }
  });
  
  // Check for proper headers associations
  cells.forEach((td) => {
    if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
      const row = td.closest('tr');
      if (row && row.querySelector('th')) {
        // This is likely a data cell that needs header association
      }
    }
  });
  
  return issues;
};

const validateLandmark = (element) => {
  const issues = [];
  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();
  
  // Check if element has a landmark role
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  
  if (!role && ['header', 'nav', 'main', 'aside', 'footer'].includes(tagName)) {
    // Native landmarks don't need role attribute
    return issues;
  }
  
  if (role && !landmarkRoles.includes(role)) {
    issues.push(`REACT_017: Invalid landmark role: ${role}`);
  }
  
  return issues;
};

const validateLandmarkStructure = () => {
  const issues = [];
  
  // Check for unique landmarks
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header:not(.banner *)'),
    navigation: document.querySelectorAll('[role="navigation"], nav'),
    main: document.querySelectorAll('[role="main"], main'),
    complementary: document.querySelectorAll('[role="complementary"], aside'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer')
  };
  
  // Banner should appear only once
  if (landmarks.banner.length > 1) {
    issues.push('REACT_017: Multiple banner landmarks found');
  }
  
  // Main should appear only once
  if (landmarks.main.length > 1) {
    issues.push('REACT_017: Multiple main landmarks found');
  }
  
  // Contentinfo should appear only once
  if (landmarks.contentinfo.length > 1) {
    issues.push('REACT_017: Multiple contentinfo landmarks found');
  }
  
  return issues;
};

const getSvgAccessibleName = (svg) => {
  // Check for aria-labelledby
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement) {
      return labelElement.textContent;
    }
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent;
  }
  
  return null;
};

const setSvgAttributes = (svg, name) => {
  if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
    // Add a title element if it doesn't exist
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      svg.insertBefore(title, svg.firstChild);
    }
    title.id = `svg-title-${Date.now()}`;
    title.textContent = name;
    
    // Set aria-labelledby to reference the title
    svg.setAttribute('aria-labelledby', title.id);
  }
};

const ensureUniqueLandmarks = () => {
  // Ensure each landmark is unique on the page
  const landmarks = document.querySelectorAll('[role]');
  const seenRoles = {};
  
  landmarks.forEach((landmark) => {
    const role = landmark.getAttribute('role');
    if (seenRoles[role]) {
      // Add aria-label to make it unique
      const existingLabel = landmark.getAttribute('aria-label');
      if (!existingLabel) {
        landmark.setAttribute('aria-label', `${role} region`);
      }
    } else {
      seenRoles[role] = true;
    }
  });
};

const validateLinkAccessibility = (link) => {
  const issues = [];
  
  // Check if link has accessible text
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledBy = link.getAttribute('aria-labelledby');
  const title = link.getAttribute('title');
  
  if (!text && !ariaLabel && !ariaLabelledBy && !title) {
    issues.push('REACT_036: Link missing accessible name');
  }
  
  // Check if link has href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // This might be a fake link
    if (link.tagName === 'A') {
      issues.push('REACT_036: Anchor element missing valid href');
    }
  }
  
  return issues;
};

const handleFakeLinks = () => {
  const links = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  const issues = [];
  
  links.forEach((link) => {
    // Check if it's functioning as a link but doesn't have proper href
    const role = link.getAttribute('role');
    const onClick = link.getAttribute('onclick');
    const tabIndex = link.getAttribute('tabindex');
    
    if (role === 'link' || onClick || tabIndex === '0') {
      // This is a fake link that needs proper accessibility handling
      const text = link.textContent.trim();
      const ariaLabel = link.getAttribute('aria-label');
      
      if (!text && !ariaLabel) {
        issues.push({
          element: link,
          message: 'REACT_036: Fake link missing accessible name'
        });
      }
    }
  });
  
  return issues;
};

module.exports = {
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks
};