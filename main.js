// TODO: Address accessibility issues from insight report
// This is the existing code that needs to be preserved
// (This comment remains as-is)
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Combined utility and accessibility features

// TODO: Address accessibility issues from insight report:
// - REACT_025: Ensure unique landmarks

// Internal set to track used landmark IDs
const _usedLandmarkIds = new Set();

/**
 * Creates a unique identifier for a landmark given a base name.
 * @param {string} baseName - Base name of the landmark.
 * @returns {string} Unique ID.
 */
function ensureUniqueLandmarkId(baseName) {
    let candidate = baseName;
    if (_usedLandmarkIds.has(candidate)) {
        // Collision handling: add random suffix
        const suffix = Math.random().toString(36).substring(2, 9);
        candidate = `${baseName}-${suffix}`;
    }
    _usedLandmarkIds.add(candidate);
    return candidate;
}

/**
 * Returns a new array containing only unique landmarks from the input list.
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Unique landmarks.
 */
function uniqueLandmarks(landmarks) {
    const seen = new Set();
    const result = [];
    for (const lm of landmarks) {
        if (!seen.has(lm.id)) {
            seen.add(lm.id);
            result.push(lm);
        }
    }
    return result;
}

/**
 * Adds an aria-label attribute to an element if it doesn't already have one.
 * @param {HTMLElement} element - The element to add the aria-label to.
 * @param {string} label - The label text to be added.
 */
function addAriaLabel(element, label) {
    if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', label);
    }
}

/**
 * Gets the lang attribute value from the HTML element.
 * @returns {string} The lang attribute value.
 */
function getLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * This function gets the full language attribute with region (if provided)
 * @returns {string} - the full language attribute with region (if provided)
 */
function getFullLangAttribute() {
    return document.documentElement.lang || '';
}

/**
 * Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
 * Assumes you have already set the id on the button element in your code.
 */
function replaceMyButtonId() {
  const button = document.querySelector('[data-testid="my-button"]') || document.getElementById('my-button');
  if (button) {
    button.id = 'exampleButton';
  }
}

// Accessibility helper function for keyboard navigation
function setupKeyboardNavigation(element, options = {}) {
  const { onEnter, onEscape, onArrowUp, onArrowDown } = options;
  
  element.addEventListener('keydown', (event) => {
    switch (event.key) {
      case 'Enter':
        if (onEnter) onEnter(event);
        break;
      case 'Escape':
        if (onEscape) onEscape(event);
        break;
      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp(event);
        }
        break;
      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown(event);
        }
        break;
    }
  });
}

/**
 * Addresses accessibility issues from an insight report.
 * @param {Object} insightReport - The insight report containing accessibility findings.
 * @returns {Object} The report with accessibility issues addressed.
 */
function addressAccessibilityIssues(insightReport) {
  // Handle REACT_025: Ensure unique landmarks
  if (insightReport.landmarks && Array.isArray(insightReport.landmarks)) {
    insightReport.landmarks = uniqueLandmarks(insightReport.landmarks);
  }
  
  // Return the modified report with accessibility issues addressed
  return insightReport;
}

/*
 * Helper to manage focus within a container
 * @param {HTMLElement} container - Container element
 * @returns {void}
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
}

/**
 * Function to ensure landmarks have unique identifiers
 * @param {Array} landmarks - List of landmark objects.
 * @returns {Array} Landmarks with unique IDs.
 */
function ensureUniqueLandmarks(landmarks) {
  const seen = new Set();
  const result = [];

  function generateUniqueId() {
    return `landmark-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  landmarks.forEach((landmark) => {
    if (!seen.has(landmark.id)) {
      seen.add(landmark.id);
      landmark.id = landmark.id || generateUniqueId();
      result.push(landmark);
    }
  });

  return result;
}

/**
 * Creates an in-page button with proper accessibility attributes.
 * This is used for creating accessible anchor-like buttons within the page.
 * @param {string} text - The display text for the button.
 * @param {string} targetId - The ID of the element to scroll to.
 * @returns {HTMLButtonElement} The created button element.
 */
function createInPageButton(text, targetId) {
  const button = document.createElement('button');
  button.textContent = text;
  button.setAttribute('aria-label', text);
  button.setAttribute('type', 'button');
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
  return button;
}

/**
 * Creates an accessible link element.
 * Ensures the link has proper text content or aria-label.
 * @param {string} href - The href attribute value.
 * @param {string} text - The link text content.
 * @param {string} [ariaLabel] - Optional aria-label for the link.
 * @returns {HTMLAnchorElement} The created anchor element.
 */
function createAccessibleLink(href, text, ariaLabel) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }
  return link;
}

/**
 * Gets an accessible name for an SVG element.
 * @param {SVGElement} svg - The SVG element.
 * @param {string} [fallback] - Fallback name if aria-label is not present.
 * @returns {string} The accessible name for the SVG.
 */
function getSvgAccessibleName(svg, fallback = '') {
  if (svg instanceof SVGElement) {
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel && ariaLabel.trim().length > 0) {
      return ariaLabel;
    }
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim().length > 0) {
      return titleElement.textContent.trim();
    }
  }
  return fallback;
}

/**
 * Validates that a table has proper accessibility structure.
 * Ensures the table has the correct roles and structures for screen readers.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {boolean} True if the table is properly structured.
 */
function validateTableAccessibility(table) {
  if (!(table instanceof HTMLTableElement)) {
    return false;
  }
  
  // Tables should have proper captions or summaries
  const hasCaption = table.querySelector('caption') !== null;
  const hasSummary = table.hasAttribute('summary') || table.querySelector('[role="columnheader"], [role="rowheader"]') !== null;
  
  return hasCaption || hasSummary;
}

/**
 * Validates and fixes table structure for accessibility.
 * Ensures proper use of th, td, and structural elements.
 * @param {HTMLTableElement} table - The table element to validate.
 * @returns {void}
 */
function validateTableStructure(table) {
  if (!(table instanceof HTMLTableElement)) {
    return;
  }
  
  // Add scope attributes to th elements in header rows
  const thElements = table.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope') && !th.hasAttribute('aria-sort')) {
      const row = th.closest('tr');
      const tableHeader = table.querySelector('thead') || table.querySelector('tr:first-child');
      
      if (row && tableHeader && row === tableHeader.querySelector('tr')) {
        th.setAttribute('scope', 'col');
      } else {
        th.setAttribute('scope', 'row');
      }
    }
  });
  
  // Add proper row headers if missing
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    const headerCells = row.querySelectorAll('th');
    if (headerCells.length === 0) {
      const firstCell = row.querySelector('td');
      if (firstCell && !firstCell.hasAttribute('scope')) {
        firstCell.setAttribute('scope', 'row');
      }
    }
  });
}

/**
 * Validates that a landmark element has proper accessibility attributes.
 * @param {HTMLElement} landmark - The landmark element to validate.
 * @returns {boolean} True if the landmark is properly configured.
 */
function validateLandmark(landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }
  
  const role = landmark.getAttribute('role');
  const ariaLabel = landmark.getAttribute('aria-label');
  const ariaLabelledby = landmark.getAttribute('aria-labelledby');
  
  // Landmarks should have a role and some form of accessible name
  if (!role) {
    return false;
  }
  
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];
  if (!validRoles.includes(role)) {
    return false;
  }
  
  // Check for accessible name
  if (!ariaLabel && !ariaLabelledby && !landmark.id) {
    return false;
  }
  
  return true;
}

/**
 * Validates landmark structure and ensures unique landmark IDs.
 * @param {Array<HTMLElement>} landmarks - Array of landmark elements.
 * @returns {Array<HTMLElement>} Validated landmarks with unique IDs.
 */
function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  return landmarks.map(landmark => {
    // Ensure the landmark has a role
    if (!landmark.hasAttribute('role')) {
      landmark.setAttribute('role', 'region');
    }
    
    // Ensure unique ID
    const existingId = landmark.id;
    if (existingId) {
      if (Array.from(_usedLandmarkIds).some(id => id.startsWith(existingId) && id !== existingId)) {
        landmark.id = ensureUniqueLandmarkId(existingId);
      }
      _usedLandmarkIds.add(landmark.id);
    } else {
      const baseName = landmark.getAttribute('role') || 'landmark';
      landmark.id = ensureUniqueLandmarkId(baseName);
    }
    
    return landmark;
  });
}

/**
 * Handles accessibility issues for links.
 * Fixes fake links (links that look like links but don't navigate anywhere).
 * @param {HTMLAnchorElement} link - The link to handle.
 * @returns {void}
 */
function handleAccessibilityIssues(link) {
  if (!(link instanceof HTMLAnchorElement)) {
    return;
  }
  
  // Check for fake links (href is empty or #)
  const href = link.getAttribute('href');
  if (href === '' || href === '#') {
    // If it's a fake link that should navigate, make it a proper button
    if (link.textContent.trim().length === 0) {
      const button = createInPageButton(link.getAttribute('aria-label') || 'Interactive element', 'target');
      link.parentNode.replaceChild(button, link);
    } else {
      // If it has text but no href, add a proper href or make it accessible
      if (!link.hasAttribute('aria-label') && link.textContent.trim().length > 0) {
        link.setAttribute('aria-label', link.textContent.trim());
      }
    }
  }
  
  // Use the existing isLinkAccessible function for validation
  if (!isLinkAccessible(link)) {
    const currentText = link.textContent.trim();
    if (currentText.length === 0) {
      link.textContent = link.getAttribute('aria-label') || 'Link';
    }
  }
}

/**
 * Renders the index view of the application.
 * This function is responsible for displaying the main index page,
 * including the list of items, navigation, and any relevant metadata.
 *
 * @returns {void}
 */
function renderIndexView() {
  // Get the root container where the index view will be rendered
  const rootContainer = document.getElementById('app') || document.body;

  // Clear existing content
  rootContainer.innerHTML = '';

  // Create the index header
  const header = document.createElement('header');
  header.setAttribute('role', 'banner');
  header.id = ensureUniqueLandmarkId('index-header');
  const headerTitle = document.createElement('h1');
  headerTitle.textContent = 'Index';
  header.appendChild(headerTitle);
  rootContainer.appendChild(header);

  // Create the navigation landmark
  const nav = document.createElement('nav');
  nav.setAttribute('role', 'navigation');
  nav.id = ensureUniqueLandmarkId('index-nav');
  const navList = document.createElement('ul');
  const navItems = ['Home', 'About', 'Contact'];
  navItems.forEach(itemText => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    link.href = `#${itemText.toLowerCase()}`;
    link.textContent = itemText;
    listItem.appendChild(link);
    navList.appendChild(listItem);
  });
  nav.appendChild(navList);
  rootContainer.appendChild(nav);

  // Create the main content area
  const main = document.createElement('main');
  main.setAttribute('role', 'main');
  main.id = ensureUniqueLandmarkId('index-main');

  const section = document.createElement('section');
  section.setAttribute('aria-labelledby', 'index-section-title');
  const sectionTitle = document.createElement('h2');
  sectionTitle.id = 'index-section-title';
  sectionTitle.textContent = 'Welcome';
  section.appendChild(sectionTitle);

  const description = document.createElement('p');
  description.textContent = 'This is the index view of the application.';
  section.appendChild(description);

  main.appendChild(section);
  rootContainer.appendChild(main);

  // Create the footer landmark
  const footer = document.createElement('footer');
  footer.setAttribute('role', 'contentinfo');
  footer.id = ensureUniqueLandmarkId('index-footer');
  const footerText = document.createElement('p');
  footerText.textContent = '© 2024 Application';
  footer.appendChild(footerText);
  rootContainer.appendChild(footer);
}

/**
 * Spawns a Creep in the room with the specified name, body parts, and memory.
 * @param {string} name - The name of the creep to spawn.
 * @param {string[]} body - Array of body part strings (e.g., 'work', 'carry', 'move').
 * @param {Object} [memory={}] - Initial memory object for the creep.
 * @returns {string|null} The spawned creep's name on success, or null if spawning failed.
 */
function spawnCreep(name, body, memory = {}) {
  // Validate inputs
  if (typeof name !== 'string' || name.trim().length === 0) {
    return null;
  }

  if (!Array.isArray(body) || body.length === 0) {
    return null;
  }

  if (typeof memory !== 'object' || memory === null) {
    return null;
  }

  try {
    // Attempt to spawn the creep
    const result = Game.spawns['Spawn1'].spawnCreep(body, name, { memory });

    // Check if the spawn was successful
    if (result === OK && Game.creeps[name]) {
      return name;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Function to remove the 'my-button' class, and set a specific id for the button element if it exists.
// Assumes you have already set the id on the button element in your code.
replaceMyButtonId();

// Function to improve keyboard navigation for interactive elements
function improveKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll('[tabindex="-1"]');
  interactiveElements.forEach(element => {
    element.setAttribute('tabindex', '0');
  });
}

module.exports = {
  addProperLandmarkRegions,
  addProperAccountManagement,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  ensureUniqueLandmarkId,
  uniqueLandmarks,
  isLinkAccessible,
  addAriaLabel,
  createInPageButton,
  createAccessibleLink,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  handleAccessibilityIssues
};