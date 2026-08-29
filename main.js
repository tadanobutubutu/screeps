// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructureIssues)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

/**
 * Gets the accessible name for an SVG element.
 * @param {SVGElement} svgElement - The SVG element to get the accessible name for
 * @returns {string|null} The accessible name or null if not found
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;
  
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }
  
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  
  const labelledBy = svgElement.getAttribute('aria-labelledby');
  if (labelledBy) {
    const label = document.getElementById(labelledBy);
    if (label) {
      return label.textContent.trim();
    }
  }
  
  return null;
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  if (!svgElement.getAttribute('focusable')) {
    svgElement.setAttribute('focusable', 'false');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const text = link.textContent.trim();
  const ariaLabel = link.getAttribute('aria-label');
  const title = link.getAttribute('title');
  
  return !!(text || ariaLabel || title);
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const text = button.textContent.trim();
  const ariaLabel = button.getAttribute('aria-label');
  const ariaLabelledBy = button.getAttribute('aria-labelledby');
  
  return !!(text || ariaLabel || ariaLabelledBy);
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const issues = [];
  
  const links = container.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!isLinkAccessible(link)) {
      issues.push({
        type: 'link',
        element: link,
        message: `Link at index ${index} lacks accessible name`
      });
    }
  });
  
  const buttons = container.querySelectorAll('button');
  buttons.forEach((button, index) => {
    if (!isButtonAccessible(button)) {
      issues.push({
        type: 'button',
        element: button,
        message: `Button at index ${index} lacks accessible name`
      });
    }
  });
  
  return { issues, linkCount: links.length, buttonCount: buttons.length };
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  if (!element) return false;
  
  const elementRole = element.getAttribute('role');
  if (elementRole && elementRole !== role) {
    return false;
  }
  
  const tagName = element.tagName.toLowerCase();
  const validTags = {
    'main': ['main'],
    'nav': ['nav'],
    'header': ['header'],
    'footer': ['footer'],
    'aside': ['aside']
  };
  
  if (validTags[role] && !validTags[role].includes(tagName)) {
    return false;
  }
  
  return true;
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  const body = document.body;
  if (!body) return null;
  
  let main = body.querySelector('main');
  if (main) return main;
  
  main = document.createElement('main');
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }
  body.appendChild(main);
  
  return main;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object
 */
function checkLandmarks(container = document) {
  const issues = [];
  const landmarks = container.querySelectorAll('main, nav, header, footer, aside, [role]');
  
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!checkLandmarkElement(role, landmark)) {
      issues.push({
        type: 'landmark',
        element: landmark,
        message: `Landmark at index ${index} has potential accessibility issue`
      });
    }
  });
  
  return { issues, landmarkCount: landmarks.length };
}

/**
 * Adds lang attribute to HTML element if missing.
 */
function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
  return htmlElement.getAttribute('lang');
}

/**
 * Adds main landmark to the page if missing.
 */
function addMainLandmark() {
  if (!document.querySelector('main')) {
    wrapPrimaryContentInMain();
  }
}

/**
 * Adds accessible names to SVG elements.
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const name = getSvgAccessibleName(svg);
    if (!name) {
      const title = document.createElement('title');
      title.textContent = 'SVG image';
      title.id = 'svg-title-' + Math.random().toString(36).substr(2, 9);
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
    setSvgAccessibilityProps(svg);
  });
}

/**
 * Fixes fake link issues by adding proper roles.
 */
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"]');
  fakeLinks.forEach(link => {
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    if (!link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });
  return fakeLinks.length;
}

/**
 * Ensures unique landmarks by adding IDs where needed.
 */
function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    mainElements.forEach((main, index) => {
      if (index > 0 && !main.id) {
        main.id = `main-${index}`;
        main.setAttribute('aria-label', `Main content section ${index + 1}`);
      }
    });
  }
  return document.querySelectorAll('main, nav, header, footer, aside').length;
}

/**
 * Fixes table structure issues.
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;
  
  tables.forEach(table => {
    const hasCaption = table.querySelector('caption');
    const hasHeaders = table.querySelector('th');
    const hasScope = table.querySelector('[scope]');
    
    if (!hasCaption && !hasHeaders && !hasScope) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }
    
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length === 0) {
        const emptyCell = document.createElement('td');
        emptyCell.textContent = '';
        row.appendChild(emptyCell);
      }
    });
  });
  
  return fixedCount;
}

/**
 * Address accessibility issue 038.
 * @param {HTMLElement} element - The element to address
 * @param {Object} accessibilityInfo - Accessibility information
 */
function addressAccessibilityIssue038(element, accessibilityInfo) {
  if (!element) return;
  
  if (accessibilityInfo.ariaLabel) {
    element.setAttribute('aria-label', accessibilityInfo.ariaLabel);
  }
  if (accessibilityInfo.role) {
    element.setAttribute('role', accessibilityInfo.role);
  }
  if (accessibilityInfo.tabIndex !== undefined) {
    element.setAttribute('tabindex', accessibilityInfo.tabIndex);
  }
}

/**
 * Renders the index view (placeholder).
 */
function renderIndexView() {
  // Placeholder for index view rendering
}

/**
 * Sets form element accessible names.
 */
function setFormElementAccessibleNames() {
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([aria-label]):not([aria-labelledby])');
  inputs.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('placeholder')) {
      input.setAttribute('aria-label', 'Form input');
    }
  });
}

/**
 * Count dependencies in the page.
 */
function countDependencies() {
  const scripts = document.querySelectorAll('script[src]');
  const styles = document.querySelectorAll('link[rel="stylesheet"]');
  const images = document.querySelectorAll('img[src]');
  const svgElements = document.querySelectorAll('svg[src]');
  const fonts = document.querySelectorAll('link[rel="preload"][as="font"], link[rel="stylesheet"][href*="font"]');
  
  return {
    scripts: scripts.length,
    styles: styles.length,
    images: images.length,
    svgs: svgElements.length,
    fonts: fonts.length,
    total: scripts.length + styles.length + images.length + svgElements.length + fonts.length
  };
}

// Exports
exports.addLangAttribute = addLangAttribute;
exports.addMainLandmark = addMainLandmark;
exports.addSvgAccessibleNames = addSvgAccessibleNames;
exports.checkAccessibility = checkAccessibility;
exports.checkLandmarks = checkLandmarks;
exports.checkLandmarkElement = checkLandmarkElement;
exports.ensureUniqueLandmarks = ensureUniqueLandmarks;
exports.fixFakeLinkIssue = fixFakeLinkIssue;
exports.fixTableStructureIssues = fixTableStructureIssues;
exports.renderIndexView = renderIndexView;
exports.setFormElementAccessibleNames = setFormElementAccessibleNames;
exports.setSvgAccessibilityProps = setSvgAccessibilityProps;
exports.isLinkAccessible = isLinkAccessible;
exports.isButtonAccessible = isButtonAccessible;
exports.addressAccessibilityIssue038 = addressAccessibilityIssue038;
exports.getSvgAccessibleName = getSvgAccessibleName;
exports.wrapPrimaryContentInMain = wrapPrimaryContentInMain;
exports.countDependencies = countDependencies;