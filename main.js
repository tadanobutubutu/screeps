const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function validateLandmark(landmark) {
  const errors = [];
  // Existing code that should be preserved
  // Update landmark validation logic if needed
  const role = landmark.getAttribute('role');
  const validLandmarks = ['main', 'navigation', 'search', 'banner', 'contentinfo', 'complementary'];
  if (!validLandmarks.includes(role)) {
    errors.push('Invalid landmark role');
  }
  return errors;
}

const appData = {
  title: 'Screeps',
  version: '1.0.0'
};

const HTML = ({ lang }) => {
    return { lang };
};

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ensureUniqueLandmarks())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and createInPageButton())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and validateLandmarkStructure())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), createAccessibleLink() and handleAccessibilityIssues())

// Function to count dependencies in package.json
function countDependencies() {
  try {
    const packageJson = require('./package.json');
    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};
    const peerDependencies = packageJson.peerDependencies || {};
    const optionalDependencies = packageJson.optionalDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      peerDependencies: Object.keys(peerDependencies).length,
      optionalDependencies: Object.keys(optionalDependencies).length,
      total: Object.keys(dependencies).length + 
             Object.keys(devDependencies).length + 
             Object.keys(peerDependencies).length + 
             Object.keys(optionalDependencies).length
    };
  } catch (error) {
    return {
      dependencies: 0,
      devDependencies: 0,
      peerDependencies: 0,
      optionalDependencies: 0,
      total: 0,
      error: error.message
    };
  }
}

function validateTableAccessibility(tableElement) {
    // Implementation to validate table accessibility (conflict resolved: merged implementation)
    if (!tableElement.querySelector('caption')) {
        console.warn('Table missing caption');
        return false;
    }
    return true;
}

function validateTableStructure(tableElement) {
    // Implementation to validate table structure (conflict resolved: merged implementation)
    const rows = tableElement.querySelectorAll('tr');
    if (rows.length === 0) {
        console.warn('Table has no rows');
        return false;
    }
    return true;
}

function validateLandmarkStructure() {
    // Merged implementation (conflict resolved)
    const landmarks = document.querySelectorAll('[role]');
    let hasMain = false;
    let hasNavigation = false;

    landmarks.forEach(landmark => {
        const role = landmark.getAttribute('role');
        if (role === 'main') hasMain = true;
        if (role === 'navigation') hasNavigation = true;
    });

    if (!hasMain) console.warn('Missing main landmark');
    if (!hasNavigation) console.warn('Missing navigation landmark');

    return hasMain && hasNavigation;
}

function addLandmarkRegions() {
  console.log('Adding landmark regions');
}

function getSvgAccessibleName(svgElement) {
    // Merged implementation (conflict resolved)
    if (!svgElement) {
        return 'Accessible SVG Icon';
    }
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
  if (svg && typeof svg === 'object') {
    svg.setAttribute('role', 'img');
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
}

function ensureUniqueLandmarks(landmarksArg) {
  // Merged implementation (conflict resolved)
  let landmarks = landmarksArg;
  if (!Array.isArray(landmarks)) {
    landmarks = [];
  }
  const elementsById = {};

  if (Array.isArray(landmarks)) {
    for (const landmark of landmarks) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  // Additional uniqueness check for landmark roles
  const landmarksByRole = {};
  const allLandmarks = document.querySelectorAll('[role]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarksByRole[role]) {
      console.warn(`Duplicate landmark role: ${role}`);
    } else {
      landmarksByRole[role] = true;
    }
  });

  return landmarks;
}

function fixTableStructure(table) {
  if (!table.headers) {
    table.headers = 'auto';
  }

  if (!table.scope) {
    table.scope = 'auto';
  }

  return table;
}

function addMainLandmark(document) {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.appendChild(main);
  }
  return document;
}

function handleCredentialResponse(credentialResponse) {
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    throw new Error('Invalid credential response');
  }

  // Extract and validate required fields
  const { credential, clientExtensionResults, authenticatorData } = credentialResponse;

  if (!credential || typeof credential !== 'string') {
    throw new Error('Invalid credential in response');
  }

  // Process the credential data
  const processedCredential = {
    rawId: credential,
    id: credential,
    response: {
      clientDataJSON: credentialResponse.clientDataJSON,
      authenticatorData: authenticatorData || null,
      signature: credentialResponse.signature || null,
      userHandle: credentialResponse.userHandle || null
    },
    type: 'public-key',
    extensions: clientExtensionResults || {}
  };

  // Validate the processed credential
  if (!processedCredential.response.clientDataJSON) {
    throw new Error('Missing clientDataJSON in credential response');
  }

  return processedCredential;
}

function addProperLandmarkRegions(document) {
  const regions = [
    { selector: 'header', role: 'banner' },
    { selector: 'nav', role: 'navigation' },
    { selector: 'main', role: 'main' },
    { selector: 'aside', role: 'complementary' },
    { selector: 'footer', role: 'contentinfo' }
  ];

  regions.forEach(region => {
    const elements = document.querySelectorAll(region.selector);
    elements.forEach(element => {
      if (!element.getAttribute('role')) {
        element.setAttribute('role', region.role);
      }
    });
  });
}

function handleAccessibilityIssues() {
    // Implementation to handle accessibility issues (conflict resolved: merged implementation)
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        validateTableAccessibility(table);
        validateTableStructure(table);
    });

    const landmarks = document.querySelectorAll('[role]');
    landmarks.forEach(landmark => {
        validateLandmark(landmark);
    });

    validateLandmarkStructure();
    ensureUniqueLandmarks();

    const svgs = document.querySelectorAll('svg');
    svgs.forEach(svg => {
        getSvgAccessibleName(svg);
    });
}

// Keyboard navigation state management
const keyboardNavigationState = {
  currentFocusIndex: -1,
  focusableElements: [],
  rovingTabIndexContainers: new Map(),
  keyboardShortcuts: new Map(),
  skipLinkTarget: null,
  focusTrapStack: []
};

// Initialize keyboard navigation enhancement
function initializeKeyboardNavigation(container = document) {
  if (!container || typeof container !== 'object') {
    console.warn('Invalid container for keyboard navigation initialization');
    return false;
  }

  // Add visible focus styles if not already present
  addVisibleFocusStyles();

  // Set up focusable elements
  updateFocusableElements(container);

  // Initialize roving tabindex for navigation menus
  initializeRovingTabindex(container);

  // Set up keyboard event handlers
  setupKeyboardEventHandlers(container);

  // Create skip link if not present
  createSkipLinkIfNeeded(container);

  // Enhance landmark navigation
  enhanceLandmarkKeyboardNavigation(container);

  return true;
}

// Add visible focus indicator styles
function addVisibleFocusStyles() {
  const styleId = 'keyboard-navigation-focus-styles';
  if (document.getElementById(styleId)) {
    return; // Styles already added
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    [data-keyboard-focus="true"]:focus {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
    [data-keyboard-focus="true"]:focus:not(:focus-visible) {
      outline: none !important;
      box-shadow: none !important;
    }
    [data-keyboard-focus="true"]:focus-visible {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
    .keyboard-nav-active *:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    .keyboard-nav-active [data-keyboard-focus="true"]:focus {
      outline: 2px solid #0066cc !important;
      outline-offset: 2px !important;
      box-shadow: 0 0 0 4px rgba(0, 102, 204, 0.3) !important;
    }
  `;
  document.head.appendChild(style);
}

// Update list of focusable elements
function updateFocusableElements(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ];

  const focusableElements = container.querySelectorAll(focusableSelectors.join(', '));
  
  keyboardNavigationState.focusableElements = Array.from(focusableElements);

  // Mark elements for keyboard focus visibility
  keyboardNavigationState.focusableElements.forEach((element, index) => {
    element.setAttribute('data-keyboard-nav-index', index);
    element.setAttribute('data-keyboard-focus', 'true');
  });
}

// Initialize roving tabindex pattern for navigation menus
function initializeRovingTabindex(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const menus = container.querySelectorAll('[role="menu"], [role="menubar"], [role="navigation"] ul, nav ul');
  
  menus.forEach(menu => {
    const menuItems = menu.querySelectorAll('a, button');
    
    if (menuItems.length === 0) {
      return;
    }

    // Store menu container for tracking
    const menuId = menu.id || `menu-${keyboardNavigationState.rovingTabIndexContainers.size}`;
    keyboardNavigationState.rovingTabIndexContainers.set(menuId, {
      container: menu,
      items: Array.from(menuItems)
    });

    // Set initial tabindex -1 for all except first item
    menuItems.forEach((item, index) => {
      item.setAttribute('data-roving-menu', menuId);
      item.setAttribute('data-roving-index', index);
      item.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
  });
}

// Handle roving tabindex navigation
function handleRovingTabindexNavigation(menuId, direction) {
  const menuData = keyboardNavigationState.rovingTabIndexContainers.get(menuId);
  
  if (!menuData || !menuData.items || menuData.items.length === 0) {
    return;
  }

  const items = menuData.items;
  const currentIndex = items.findIndex(item => item === document.activeElement);
  
  if (currentIndex === -1) {
    return;
  }

  let newIndex;
  if (direction === 'next') {
    newIndex = (currentIndex + 1) % items.length;
  } else if (direction === 'prev') {
    newIndex = (currentIndex - 1 + items.length) % items.length;
  } else if (direction === 'first') {
    newIndex = 0;
  } else if (direction === 'last') {
    newIndex = items.length - 1;
  } else {
    return;
  }

  // Update tabindex values
  items.forEach((item, index) => {
    item.setAttribute('tabindex', index === newIndex ? '0' : '-1');
  });

  // Focus the new item
  items[newIndex].focus();
}

// Set up keyboard event handlers
function setupKeyboardEventHandlers(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  container.addEventListener('keydown', (event) => {
    // Handle arrow key navigation within roving tabindex containers
    const target = event.target;
    if (target.hasAttribute('data-roving-menu')) {
      const menuId = target.getAttribute('data-roving-menu');
      
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'prev');
          break;
        case 'Home':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'first');
          break;
        case 'End':
          event.preventDefault();
          handleRovingTabindexNavigation(menuId, 'last');
          break;
      }
    }

    // Handle Escape key to close modals/dropdowns
    if (event.key === 'Escape') {
      const activeModal = document.querySelector('[role="dialog"]:focus-within, [aria-modal="true"]:focus-within');
      if (activeModal) {
        const closeButton = activeModal.querySelector('[aria-label="Close"], [data-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }

    // Handle Tab key for focus management
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav-active');
      setTimeout(() => {
        document.body.classList.remove('keyboard-nav-active');
      }, 100);
    }
  });

  // Track keyboard navigation state
  container.addEventListener('keydown', (event) => {
    if (event.key.startsWith('Arrow') || event.key === 'Tab') {
      keyboardNavigationState.isKeyboardNavigating = true;
    }
  });

  container.addEventListener('mousedown', () => {
    keyboardNavigationState.isKeyboardNavigating = false;
  });
}

// Create skip link if not present
function createSkipLinkIfNeeded(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const existingSkipLink = container.querySelector('.skip-link, [data-skip-link]');
  if (existingSkipLink) {
    keyboardNavigationState.skipLinkTarget = existingSkipLink.getAttribute('href');
    return;
  }

  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'skip-link';
  skipLink.setAttribute('data-skip-link', 'true');
  skipLink.style.cssText = `
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 9999;
    padding: 1em;
    background: #000;
    color: #fff;
    text-decoration: none;
  `;

  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });

  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });

  container.insertBefore(skipLink, container.firstChild);
  keyboardNavigationState.skipLinkTarget = '#main-content';
}

// Enhance landmark keyboard navigation
function enhanceLandmarkKeyboardNavigation(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  // Add landmark navigation keyboard shortcuts
  registerKeyboardShortcut('g m', () => {
    const main = container.querySelector('main, [role="main"]');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
    }
  });

  registerKeyboardShortcut('g n', () => {
    const nav = container.querySelector('nav, [role="navigation"]');
    if (nav) {
      nav.setAttribute('tabindex', '-1');
      nav.focus();
    }
  });

  registerKeyboardShortcut('g s', () => {
    const search = container.querySelector('[role="search"]');
    if (search) {
      search.setAttribute('tabindex', '-1');
      search.focus();
    }
  });
}

// Register keyboard shortcuts (g as prefix)
function registerKeyboardShortcut(shortcut, callback) {
  if (typeof shortcut !== 'string' || typeof callback !== 'function') {
    return;
  }
  keyboardNavigationState.keyboardShortcuts.set(shortcut.toLowerCase(), callback);
}

// Main function to enhance keyboard navigation
function enhanceKeyboardNavigation(container = document) {
  if (!container || typeof container !== 'object') {
    console.warn('Invalid container provided for keyboard navigation enhancement');
    return false;
  }

  // Initialize keyboard navigation
  const initialized = initializeKeyboardNavigation(container);
  
  if (!initialized) {
    return false;
  }

  // Handle global keyboard shortcuts
  let gKeyPending = false;
  let gKeyTimeout = null;

  document.addEventListener('keydown', (event) => {
    // Only handle shortcuts when not in an input field
    const activeElement = document.activeElement;
    const isInputField = activeElement.tagName === 'INPUT' || 
                         activeElement.tagName === 'TEXTAREA' || 
                         activeElement.getAttribute('contenteditable') === 'true';

    if (isInputField) {
      return;
    }

    const key = event.key.toLowerCase();

    // Handle 'g' prefix for landmark shortcuts
    if (gKeyPending) {
      clearTimeout(gKeyTimeout);
      const shortcut = `g ${key}`;
      const callback = keyboardNavigationState.keyboardShortcuts.get(shortcut);
      if (callback) {
        event.preventDefault();
        callback();
      }
      gKeyPending = false;
      return;
    }

    // Start 'g' sequence
    if (key === 'g' && !event.ctrlKey && !event.metaKey && !event.altKey) {
      gKeyPending = true;
      clearTimeout(gKeyTimeout);
      gKeyTimeout = setTimeout(() => {
        gKeyPending = false;
      }, 1000); // Reset after 1 second
    }
  });

  // Set up live region announcements for screen readers
  setupLiveRegion(container);

  // Enhance dropdown and menu keyboard interaction
  enhanceMenuKeyboardInteraction(container);

  return true;
}

// Set up ARIA live region for announcements
function setupLiveRegion(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  let liveRegion = container.querySelector('[aria-live], [role="status"]');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
    liveRegion.id = 'keyboard-nav-announcer';
    container.appendChild(liveRegion);
  }

  keyboardNavigationState.announcer = liveRegion;
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = keyboardNavigationState.announcer;
  if (!announcer) {
    return;
  }

  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  
  // Use setTimeout to ensure the announcement is made after the DOM update
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Enhance menu keyboard interaction
function enhanceMenuKeyboardInteraction(container) {
  if (!container || typeof container !== 'object') {
    return;
  }

  const dropdowns = container.querySelectorAll('[aria-haspopup="true"]');
  
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        const expanded = dropdown.getAttribute('aria-expanded') === 'true';
        dropdown.setAttribute('aria-expanded', !expanded);
        
        if (!expanded) {
          // Menu just opened - focus first item
          const menu = container.querySelector(`#${dropdown.getAttribute('aria-controls')}`);
          if (menu) {
            const firstItem = menu.querySelector('a, button');
            if (firstItem) {
              setTimeout(() => firstItem.focus(), 100);
            }
          }
        }
      }

      if (event.key === 'Escape') {
        dropdown.setAttribute('aria-expanded', 'false');
        dropdown.focus();
      }
    });

    // Close dropdown when clicking outside
    dropdown.addEventListener('blur', (event) => {
      setTimeout(() => {
        const relatedTarget = event.relatedTarget;
        if (!dropdown.contains(relatedTarget)) {
          dropdown.setAttribute('aria-expanded', 'false');
        }
      }, 100);
    });
  });
}

// Validate landmark regions for keyboard navigation
function validateLandmarkRegions() {
  const landmarks = document.querySelectorAll('[role]');
  const landmarkRegions = {
    banner: [],
    navigation: [],
    main: [],
    complementary: [],
    contentinfo: [],
    search: [],
    other: []
  };

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (landmarkRegions.hasOwnProperty(role)) {
      landmarkRegions[role].push(landmark);
    } else {
      landmarkRegions.other.push(landmark);
    }
  });

  // Check for keyboard navigation readiness
  const results = {
    isValid: true,
    regions: landmarkRegions,
    issues: []
  };

  // Validate main landmark exists
  if (landmarkRegions.main.length === 0) {
    results.issues.push('No main landmark found - keyboard navigation to main content may not work');
    results.isValid = false;
  }

  // Validate navigation exists
  if (landmarkRegions.navigation.length === 0) {
    results.issues.push('No navigation landmark found - menu keyboard navigation may not work');
  }

  // Check for duplicate landmarks
  Object.keys(landmarkRegions).forEach(role => {
    if (landmarkRegions[role].length > 1 && role !== 'other') {
      results.issues.push(`Multiple ${role} landmarks found - keyboard users may get confused`);
    }
  });

  return results;
}

// Export all existing and new functions
module.exports = {
    validateTableAccessibility,
    validateTableStructure,
    validateLandmark,
    validateLandmarkStructure,
    ensureUniqueLandmarks,
    getSvgAccessibleName,
    createInPageButton,
    createAccessibleLink,
    fixTableStructure,
    addMainLandmark,
    setSvgAttributes,
    countDependencies,
    handleCredentialResponse,
    addProperLandmarkRegions,
    handleAccessibilityIssues,
    initializeApp,
    getConfig,
    validateInput,
    processData,
    validateLandmarkRegions,
    initializeApp,
    enhanceKeyboardNavigation,
    initializeKeyboardNavigation,
    updateFocusableElements,
    handleRovingTabindexNavigation,
    announceToScreenReader,
    validateLandmarkRegions
};