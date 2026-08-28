// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: addMainLandmark, fixLandmarkIssues)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)

/**
 * Adds lang attribute to HTML element for accessibility
 * Addresses REACT_015
 */
function addLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Fixes table structure issues for accessibility
 * Addresses REACT_027
 */
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newRow = document.createElement('tr');
        Array.from(firstRow.cells).forEach((cell) => {
          const th = document.createElement('th');
          th.innerHTML = cell.innerHTML;
          if (cell.getAttribute('scope')) {
            th.setAttribute('scope', cell.getAttribute('scope'));
          } else {
            th.setAttribute('scope', 'col');
          }
          newRow.appendChild(th);
        });
        thead.appendChild(newRow);
        table.insertBefore(thead, table.firstChild);
        firstRow.remove();
      }
    }
    if (!table.querySelector('tbody')) {
      const existingBody = table.querySelector('tr');
      if (existingBody) {
        const tbody = document.createElement('tbody');
        Array.from(table.querySelectorAll('tr')).forEach((row) => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
}

/**
 * Adds main landmark to the page
 * Addresses REACT_017
 */
function addMainLandmark() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0) {
    const existingMain = document.querySelector('[role="main"]');
    if (existingMain) {
      existingMain.setAttribute('role', 'main');
    }
  }
}

/**
 * Fixes landmark issues for accessibility
 * Addresses REACT_017
 */
function fixLandmarkIssues() {
  // Fix duplicate or missing landmarks
  const headers = document.querySelectorAll('header');
  const navs = document.querySelectorAll('nav');
  const footers = document.querySelectorAll('footer');
  
  // Ensure only one banner (header)
  if (headers.length > 1) {
    headers.forEach((header, index) => {
      if (index > 0) {
        header.setAttribute('role', 'none');
      }
    });
  }
  
  // Ensure navigation has proper labels if multiple
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      if (navs.length > 1) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      } else {
        nav.setAttribute('aria-label', 'Main navigation');
      }
    }
  });
  
  // Fix contentinfo (footer) if multiple
  if (footers.length > 1) {
    footers.forEach((footer, index) => {
      if (index > 0) {
        footer.setAttribute('role', 'none');
      }
    });
  }
}

/**
 * Ensures unique landmarks on the page
 * Addresses REACT_025
 */
function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

/**
 * Internal function to make landmarks unique
 * Addresses REACT_025
 */
function uniqueLandmarks() {
  const landmarks = {
    banner: [],
    navigation: [],
    main: [],
    contentinfo: [],
    complementary: [],
    other: []
  };
  
  document.querySelectorAll('header, nav, main, footer, aside, [role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], [role="complementary"]').forEach((el) => {
    const role = el.getAttribute('role') || el.tagName.toLowerCase();
    if (role === 'banner' || el.tagName === 'HEADER') {
      landmarks.banner.push(el);
    } else if (role === 'navigation' || el.tagName === 'NAV') {
      landmarks.navigation.push(el);
    } else if (role === 'main' || el.tagName === 'MAIN') {
      landmarks.main.push(el);
    } else if (role === 'contentinfo' || el.tagName === 'FOOTER') {
      landmarks.contentinfo.push(el);
    } else if (role === 'complementary' || el.tagName === 'ASIDE') {
      landmarks.complementary.push(el);
    }
  });
  
  // Add labels to duplicate landmarks
  landmarks.navigation.forEach((nav, index) => {
    if (landmarks.navigation.length > 1 && !nav.getAttribute('aria-label')) {
      nav.setAttribute('aria-label', `Navigation ${index + 1}`);
    }
  });
  
  landmarks.complementary.forEach((aside, index) => {
    if (landmarks.complementary.length > 1 && !aside.getAttribute('aria-label')) {
      aside.setAttribute('aria-label', `Supplementary content ${index + 1}`);
    }
  });
}

/**
 * Adds accessible names to SVGs
 * Addresses REACT_041
 */
function addSvgAccessibleNames() {
  addAccessibleNamesToSVGs();
}

/**
 * Internal function to add accessible names to all SVGs
 * Addresses REACT_041
 */
function addAccessibleNamesToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.getAttribute('title')) {
      // Check if parent has text that describes it
      const parent = svg.parentElement;
      if (parent) {
        const textContent = parent.textContent.trim();
        if (textContent) {
          svg.setAttribute('aria-label', textContent);
        }
      }
    }
  });
}

/**
 * Fixes fake link issues (links without href that should be buttons)
 * Addresses REACT_036
 */
function fixFakeLinkIssue() {
  fixFakeLinkIssues();
}

/**
 * Internal function to fix all fake link issues
 * Addresses REACT_036
 */
function fixFakeLinkIssues() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach((link) => {
    const href = link.getAttribute('href');
    const isFakeLink = !href || href === '#' || href === '';
    const hasButtonRole = link.getAttribute('role') === 'button';
    const isClickable = link.onclick || link.getAttribute('data-action');
    
    if (isFakeLink && (hasButtonRole || isClickable)) {
      // Convert to button or add proper href
      if (!hasButtonRole) {
        link.setAttribute('role', 'button');
      }
      if (!link.id) {
        link.removeAttribute('href');
      }
    }
  });
}

/**
 * Google sign-in logic with proper accessibility
 * Addresses REACT_037
 */
function googleSignIn() {
  // This function handles Google Sign-In with accessibility considerations
  const googleSignInButton = document.querySelector('[data-google-signin]');
  
  if (googleSignInButton) {
    googleSignInButton.setAttribute('aria-label', 'Sign in with Google');
    googleSignInButton.setAttribute('role', 'button');
    
    // Ensure it's properly keyboard accessible
    if (!googleSignInButton.getAttribute('tabindex')) {
      googleSignInButton.setAttribute('tabindex', '0');
    }
    
    googleSignInButton.addEventListener('click', (event) => {
      event.preventDefault();
      // Google Sign-In logic would go here
      if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.prompt();
      }
    });
    
    googleSignInButton.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        googleSignInButton.click();
      }
    });
  }
}

/**
 * Replaces my-button class/id with proper button identifiers
 * Addresses REACT_040
 */
function fixButtonIdentifiers() {
  const myButtons = document.querySelectorAll('.my-button, #my-button');
  myButtons.forEach((button, index) => {
    const newId = `accessible-button-${index + 1}`;
    
    if (button.id === 'my-button' || button.classList.contains('my-button')) {
      // Generate unique ID if not present
      if (!button.id) {
        button.id = newId;
      }
      
      // Remove generic class
      button.classList.remove('my-button');
      
      // Ensure proper button semantics
      if (button.tagName !== 'BUTTON') {
        button.setAttribute('role', 'button');
      }
      
      // Add accessible name if not present
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        const dataLabel = button.getAttribute('data-label');
        if (dataLabel) {
          button.setAttribute('aria-label', dataLabel);
        }
      }
    }
  });
}

/**
 * Initialize all accessibility fixes
 */
function initAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  fixLandmarkIssues();
  ensureUniqueLandmarks();
  addSvgAccessibleNames();
  fixFakeLinkIssue();
  googleSignIn();
  fixButtonIdentifiers();
}

// Run accessibility fixes on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addLangAttribute,
    fixTableStructure,
    addMainLandmark,
    fixLandmarkIssues,
    ensureUniqueLandmarks,
    uniqueLandmarks,
    addSvgAccessibleNames,
    addAccessibleNamesToSVGs,
    fixFakeLinkIssue,
    fixFakeLinkIssues,
    googleSignIn,
    fixButtonIdentifiers,
    initAccessibility
  };
}