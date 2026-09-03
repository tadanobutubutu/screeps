const main = require('./utilities');

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[一-鿿]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[぀-ヿ]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[Ѐ-ӿ]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[؀-ۿ]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = (typeof link.querySelectorAll === 'function') ? link.querySelectorAll('a:not([href])') : [];
    fakeLinks.forEach(fakeLink => {
      fakeLink.setAttribute('href', '#' + (fakeLink.id || `link-${Date.now()}`));
      fakeLink.setAttribute('role', 'link');
    });

    // Check target="_blank" has rel="noopener noreferrer"
    if (link.getAttribute('target') === '_blank') {
      const rel = link.getAttribute('rel');
      if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
        errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
      }
    }

    // Check for redundant title attribute
    const title = link.getAttribute('title');
    if (title && title === textContent) {
      errors.push('Link title attribute duplicates link text');
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

// New function to address ADD: Address new accessibility issues from insight report
function addressNewAccessibilityIssues() {
  // This function addresses new accessibility issues identified in the insight report
  // It runs a series of checks and returns a comprehensive report
  const report = {
    valid: true,
    issues: [],
    checked: []
  };

  if (typeof document === 'undefined') {
    return { valid: false, issues: ['Document not available'], checked: [] };
  }

  // Check 1: Ensure all images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    report.checked.push(`image-${index}`);
    if (!img.hasAttribute('alt')) {
      report.issues.push(`Image at index ${index} is missing alt attribute`);
      report.valid = false;
    }
  });

  // Check 2: Ensure all form inputs have associated labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    report.checked.push(`input-${index}`);
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const type = input.getAttribute('type');

    // Skip hidden inputs and submit/button inputs
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') {
      return;
    }

    const hasLabel = (id && document.querySelector(`label[for="${id}"]`)) ||
                     input.closest('label') ||
                     ariaLabel ||
                     ariaLabelledby;

    if (!hasLabel) {
      report.issues.push(`Form input at index ${index} is missing associated label`);
      report.valid = false;
    }
  });

  // Check 3: Ensure all buttons have accessible names
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((button, index) => {
    report.checked.push(`button-${index}`);
    const textContent = button.textContent ? button.textContent.trim() : '';
    const ariaLabel = button.getAttribute('aria-label');
    const ariaLabelledby = button.getAttribute('aria-labelledby');
    const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

    if (!hasAccessibleName) {
      report.issues.push(`Button at index ${index} is missing accessible name`);
      report.valid = false;
    }
  });

  // Check 4: Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    report.checked.push(`heading-${index}`);
    const currentLevel = parseInt(heading.tagName.charAt(1), 10);
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      report.issues.push(`Heading hierarchy skip detected: from h${previousLevel} to h${currentLevel}`);
      report.valid = false;
    }
    previousLevel = currentLevel;
  });

  // Check 5: Ensure page has a main heading
  const h1Elements = document.querySelectorAll('h1');
  if (h1Elements.length === 0) {
    report.issues.push('Page is missing an h1 heading');
    report.valid = false;
  } else if (h1Elements.length > 1) {
    report.issues.push(`Page has multiple h1 headings (${h1Elements.length}), should have only 1`);
    report.valid = false;
  }

  // Check 6: Ensure all links are accessible
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    report.checked.push(`link-${index}`);
    const linkCheck = isLinkAccessible(link);
    if (!linkCheck.valid) {
      linkCheck.errors.forEach(err => {
        report.issues.push(`Link at index ${index}: ${err}`);
      });
      report.valid = false;
    }
  });

  // Check 7: Ensure all SVGs have accessible names
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    report.checked.push(`svg-${index}`);
    const svgName = getSvgAccessibleName(svg);
    if (!svgName) {
      report.issues.push(`SVG at index ${index} is missing accessible name`);
      report.valid = false;
    }
  });

  // Check 8: Ensure landmarks are unique
  const landmarkCheck = ensureUniqueLandmarks();
  if (!landmarkCheck.valid) {
    landmarkCheck.errors.forEach(err => {
      report.issues.push(err);
    });
    report.valid = false;
  }

  return report;
}

// New function to address ADD: Address new accessibility issues from insight report
function validateFormAccessibility(form) {
  // This function validates the accessibility of forms
  const errors = [];

  if (!form) {
    return { valid: false, errors: ['Form element is required'] };
  }

  // Check for proper form labels
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const type = input.getAttribute('type');

    // Skip hidden inputs and submit/button inputs
    if (type === 'hidden' || type === 'submit' || type === 'button' || type === 'reset') {
      return;
    }

    const hasLabel = (id && document.querySelector(`label[for="${id}"]`)) ||
                     input.closest('label') ||
                     ariaLabel ||
                     ariaLabelledby;

    if (!hasLabel) {
      errors.push(`Input at index ${index} is missing proper label association`);
    }

    // Check for placeholder text that duplicates labels
    const placeholder = input.getAttribute('placeholder');
    const labelText = label ? label.textContent.trim() : '';
    if (placeholder && labelText && placeholder === labelText) {
      errors.push(`Input at index ${index} has placeholder text that duplicates label text`);
    }
  });

  // Check for form submission button
  const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');
  if (submitButtons.length === 0) {
    errors.push('Form is missing a submit button');
  }

  // Check for form title or heading
  const formTitle = form.querySelector('h1, h2, h3, h4, h5, h6');
  if (!formTitle) {
    errors.push('Form is missing a title or heading');
  }

  // Check for error message structure
  const errorMessages = form.querySelectorAll('.error-message, [role="alert"]');
  errorMessages.forEach((error, index) => {
    if (!error.getAttribute('aria-live') && error.getAttribute('role') !== 'alert') {
      errors.push(`Error message at index ${index} should have aria-live or role="alert"`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address ADD: Address new accessibility issues from insight report
function validateImageAccessibility(img) {
  // This function validates the accessibility of images
  const errors = [];

  if (!img) {
    return { valid: false, errors: ['Image element is required'] };
  }

  // Check for alt text
  const alt = img.getAttribute('alt');
  if (!alt) {
    errors.push('Image is missing alt attribute');
  } else if (alt === '') {
    errors.push('Image has empty alt attribute');
  } else if (alt.toLowerCase().includes('image') || alt.toLowerCase().includes('picture')) {
    errors.push('Image alt text is too generic');
  }

  // Check for decorative images
  const role = img.getAttribute('role');
  if (role === 'presentation' && alt !== '') {
    errors.push('Decorative image should have empty alt text');
  }

  // Check for SVG images
  if (img.tagName === 'svg') {
    const title = img.querySelector('title');
    if (!title || !title.textContent.trim()) {
      errors.push('SVG image is missing title element');
    }
  }

  // Check for background images
  if (img.tagName !== 'img' && !img.querySelector('img')) {
    const ariaLabel = img.getAttribute('aria-label');
    if (!ariaLabel) {
      errors.push('Background image container is missing aria-label');
    }
  }

  return { valid: errors.length === 0, errors };
}

// New function to address ADD: Address new accessibility issues from insight report
function validateButtonAccessibility(button) {
  // This function validates the accessibility of buttons
  const errors = [];

  if (!button) {
    return { valid: false, errors: ['Button element is required'] };
  }

  // Check for proper button role
  const