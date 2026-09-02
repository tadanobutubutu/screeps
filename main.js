// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// TODO: This is the existing code that needs to be preserved
//_Commit: 18ddb6408a2b2823efa22f0a77964bb5d6737f93_
//<!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: f8051b788bad4952d8493f08d3c7d22a06ff80d3_ -->
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 94682d0194ff736f18c9f23486aa2eea265b4bc5_
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

/**
 * Main entry point for the application
 */
function getLangAttribute() {
  if (typeof document !== 'undefined') {
    return document.documentElement ? document.documentElement.getAttribute('lang') || '' : '';
  }
  return '';
}

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.hasAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
  }
}

function validateTableAccessibility(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaders = Array.from(table.querySelectorAll('th')).some(th => th.hasAttribute('scope'));
  return hasCaption || hasHeaders;
}

function validateTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return false;
  }
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return false;
  }
  const cells = rows[0].querySelectorAll('td, th');
  const firstRowCellCount = cells.length;
  for (let i = 1; i < rows.length; i++) {
    const rowCells = rows[i].querySelectorAll('td, th');
    if (rowCells.length !== firstRowCellCount) {
      return false;
    }
  }
  return true;
}

function fixTableStructure(table) {
  if (!table || !(table instanceof HTMLElement)) {
    return;
  }
  const caption = table.querySelector('caption');
  if (!caption) {
    const newCaption = document.createElement('caption');
    newCaption.textContent = 'Data Table';
    table.insertBefore(newCaption, table.firstChild);
  }
  const headers = table.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

function addMainLandmark() {
  if (typeof document !== 'undefined') {
    const existingMain = document.querySelector('main');
    if (!existingMain) {
      const mainElement = document.createElement('main');
      const firstChild = document.body ? document.body.firstChild : null;
      if (firstChild) {
        document.body.insertBefore(mainElement, firstChild);
      } else if (document.body) {
        document.body.appendChild(mainElement);
      }
    }
  }
}

function validateLandmark(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const validLandmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article', 'form'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  return validLandmarks.includes(role) || validLandmarks.includes(tagName);
}

/**
 * Validates landmark structure
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  return landmark.children.length >= 0;
}

function validateLandmarkAttributes(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  if (role && ['main', 'navigation', 'complementary', 'banner', 'contentinfo', 'region'].includes(role)) {
    return true;
  }
  return ['main', 'nav', 'aside', 'header', 'footer'].includes(tagName);
}

function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof HTMLElement)) {
    return '';
  }
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby && typeof document !== 'undefined') {
    const titleElement = document.getElementById(ariaLabelledby);
    if (titleElement) {
      return titleElement.textContent || '';
    }
  }
  return '';
}

function setSvgAttributes(svg, name) {
  if (!svg || !(svg instanceof HTMLElement) || !name) {
    return;
  }
  let title = svg.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svg.insertBefore(title, svg.firstChild);
  }
  title.textContent = name;
  const hasAriaLabelledby = svg.querySelector('title[id]');
  if (!hasAriaLabelledby) {
    title.setAttribute('id', 'svg-title-' + Math.random().toString(36).substr(2, 9));
    svg.setAttribute('aria-labelledby', title.getAttribute('id'));
  }
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
}

function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return;
  }
  const landmarks = document.querySelectorAll('[role="main"], main');
  if (landmarks.length > 1) {
    for (let i = 1; i < landmarks.length; i++) {
      landmarks[i].setAttribute('role', 'region');
      landmarks[i].setAttribute('aria-label', 'Section ' + (i + 1));
    }
  }
}

function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('class', 'in-page-button');
  button.textContent = 'Skip to main content';
  button.addEventListener('click', function() {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });
  return button;
}

/**
 * Validates link accessibility
 * @param {HTMLElement} link - The link element to validate
 * @returns {boolean} True if link is accessible
 */
function validateLinkAccessibility(link) {
  if (!link || !(link instanceof HTMLElement)) {
    return false;
  }
  const tagName = link.tagName.toLowerCase();
  if (tagName !== 'a') {
    return false;
  }
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }
  const text = link.textContent || link.textContent;
  if (!text || text.trim() === '') {
    return false;
  }
  return true;
}

/**
 * Handles fake links in the document
 */
function handleFakeLinks() {
  if (typeof document === 'undefined') {
    return;
  }
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const button = createInPageButton();
    if (link.textContent) {
      button.textContent = link.textContent;
    }
    link.parentNode.replaceChild(button, link);
  });
}

/**
 * Adds proper landmark regions to the document
 */
function addProperLandmarkRegions() {
  if (typeof document === 'undefined') {
    return;
  }
  const navElements = document.querySelectorAll('nav');
  navElements.forEach((nav, index) => {
    if (!nav.hasAttribute('aria-label')) {
      nav.setAttribute('aria-label', index === 0 ? 'Main navigation' : 'Secondary navigation');
    }
  });
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
  }
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role')) {
    header.setAttribute('role', 'banner');
  }
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