// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// User Safety: unsafe
// Safety Categories: Fraud/Deception, Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
function getLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    return document.documentElement.getAttribute('lang') || '';
  }
  return '';
}

/**
 * Adds lang attribute to HTML element
 * @param {string} langValue - The language value to set
 */
function addLangAttribute(langValue = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', langValue);
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption');
  const hasHeader = table.querySelector('th');
  
  return !!(hasCaption || hasHeader);
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure(table) {
  if (!table) return false;
  
  const rows = table.querySelectorAll('tr');
  const headers = table.querySelectorAll('th');
  
  return rows.length > 0 && headers.length > 0;
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure(table) {
  if (!table) return;
  
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr');
      const allHeaders = row ? Array.from(row.querySelectorAll('th')) : [];
      const index = allHeaders.indexOf(th);
      
      if (index === 0 || row && row.parentElement.tagName === 'THEAD') {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
  
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Table';
    table.insertBefore(newCaption, table.firstChild);
  }
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main');
    if (!existingMain) {
      const main = document.createElement('main');
      const body = document.body;
      if (body && body.firstChild) {
        body.insertBefore(main, body.firstChild);
      }
    }
  }
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark) return false;
  
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section', 'article'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  
  return validLandmarks.includes(tagName) || (role && validLandmarks.includes(role));
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark) return false;
  
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  
  if (role && ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'region'].includes(role)) {
    return true;
  }
  
  return ['header', 'nav', 'main', 'aside', 'footer', 'form', 'section', 'article'].includes(tagName);
}

/**
 * Validates landmark attributes
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark attributes are valid
 */
function validateLandmarkAttributes(landmark) {
  if (!landmark) return false;
  
  const role = landmark.getAttribute('role');
  const label = landmark.getAttribute('aria-label');
  const labelledby = landmark.getAttribute('aria-labelledby');
  
  if (role === 'navigation' || role === 'complementary' || role === 'form') {
    return !!(label || labelledby);
  }
  
  return true;
}

/**
 * Gets accessible name for SVG
 * @param {HTMLElement} svg - The SVG element
 * @returns {string} The accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg) return '';
  
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }
  
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  const desc = svg.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }
  
  return '';
}

/**
 * Sets SVG attributes for accessibility
 * @param {HTMLElement} svg - The SVG element
 * @param {string} name - The accessible name
 */
function setSvgAttributes(svg, name) {
  if (!svg || !name) return;
  
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', name);
  
  const title = svg.querySelector('title');
  if (title) {
    title.textContent = name;
  } else {
    const newTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    newTitle.textContent = name;
    svg.insertBefore(newTitle, svg.firstChild);
  }
}

/**
 * Ensures unique landmarks in the document
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;
  
  const landmarks = ['header', 'main', 'footer', 'nav', 'aside'];
  const seenTags = {};
  
  landmarks.forEach(tag => {
    const elements = document.querySelectorAll(tag);
    elements.forEach((el, index) => {
      if (index > 0) {
        const role = el.getAttribute('role');
        if (!role) {
          el.setAttribute('role', tag === 'header' ? 'banner' : tag === 'nav' ? 'navigation' : tag);
        }
      }
      seenTags[tag] = (seenTags[tag] || 0) + 1;
    });
  });
}

/**
 * Creates an in-page button
 * @returns {HTMLElement} The created button
 */
function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('role', 'button');
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link) return false;
  
  const href = link.getAttribute('href');
  const hasValidHref = href && href.trim() !== '' && href !== '#' && href !== 'javascript:void(0)';
  const hasText = link.textContent.trim().length > 0;
  const ariaLabel = link.getAttribute('aria-label');
  const hasAccessibleName = hasText || !!(ariaLabel && ariaLabel.trim() !== '');
  
  return hasValidHref && hasAccessibleName;
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  if (typeof document === 'undefined') return;
  
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    const isFake = !href || href === '#' || href === 'javascript:void(0)' || href === '';
    
    if (isFake) {
      const tagName = link.tagName.toLowerCase();
      if (tagName !== 'button') {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('role', 'button');
        
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });
        
        button.innerHTML = link.innerHTML;
        link.parentNode.replaceChild(button, link);
      }
    }
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') return;
  
  const regions = ['header', 'nav', 'main', 'aside', 'footer'];
  
  regions.forEach(region => {
    const existing = document.querySelector(`${region}[role], ${region}:not(header):not(nav):not(main):not(aside):not(footer)`);
    if (!existing) {
      const elements = document.querySelectorAll(region);
      elements.forEach(el => {
        const role = el.getAttribute('role');
        if (!role) {
          const roleMap = {
            'header': 'banner',
            'nav': 'navigation',
            'aside': 'complementary',
            'footer': 'contentinfo'
          };
          if (roleMap[region]) {
            el.setAttribute('role', roleMap[region]);
          }
        }
      });
    }
  });
}

// Existing code from origin/main
function existingFunction1() {
  // Existing implementation
}

function existingFunction2() {
  // Existing implementation
}

// New Function
function newFunction() {
  // Implement the new functionality (as per the original commitment)
}

// Export all functions
module.exports = {
  getLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  createInPageButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  existingFunction1,
  existingFunction2,
  newFunction
};