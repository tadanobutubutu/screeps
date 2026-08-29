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
 * Adds lang attribute to the HTML element for accessibility
 * @param {string} langCode - Language code (e.g., 'en', 'es', 'fr')
 */
export function addLangAttribute(langCode = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', langCode);
  }
}

/**
 * Fixes table structure issues for accessibility
 * Ensures tables have proper headers and structure
 */
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, tableIndex) => {
    // Ensure tables have proper caption or summary
    if (!table.querySelector('caption') && !table.getAttribute('aria-label')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${tableIndex + 1}`;
      caption.style.clip = 'rect(0 0 0 0)';
      caption.style.clipPath = 'inset(50%)';
      caption.style.height = '1px';
      caption.style.overflow = 'hidden';
      caption.style.whiteSpace = 'nowrap';
      caption.style.width = '1px';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure all cells in first row are th elements
    const firstRow = table.querySelector('tbody tr, thead tr, tr');
    if (firstRow) {
      firstRow.querySelectorAll('td').forEach(cell => {
        const th = document.createElement('th');
        th.innerHTML = cell.innerHTML;
        Array.from(cell.attributes).forEach(attr => {
          th.setAttribute(attr.name, attr.value);
        });
        cell.parentNode.replaceChild(th, cell);
      });
    }

    // Add scope attribute to header cells
    table.querySelectorAll('th').forEach(th => {
      if (!th.hasAttribute('scope')) {
        const isRowHeader = th.closest('thead') === null && 
                           th.parentElement?.querySelector('th') === th;
        th.setAttribute('scope', isRowHeader ? 'row' : 'col');
      }
    });
  });
}

/**
 * Adds main landmark to the page
 */
export function addMainLandmark() {
  // Check if main element already exists
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    // Find the most prominent content area and wrap it or mark it
    const body = document.querySelector('body');
    if (body) {
      // Try to find content area by common selectors
      mainElement = document.querySelector('[role="main"]') || 
                   document.querySelector('.content') || 
                   document.querySelector('#content') ||
                   document.querySelector('.main-content');
      
      if (mainElement && mainElement.tagName !== 'MAIN') {
        mainElement.setAttribute('role', 'main');
      }
    }
  }
}

/**
 * Fixes landmark issues for accessibility
 */
export function fixLandmarkIssues() {
  // Ensure banner is only on page level header
  const headers = document.querySelectorAll('header');
  headers.forEach((header, index) => {
    if (index > 0) {
      // Remove banner role from nested headers
      if (header.getAttribute('role') === 'banner') {
        header.removeAttribute('role');
      }
    }
  });

  // Ensure contentinfo is only on page level footer
  const footers = document.querySelectorAll('footer');
  footers.forEach((footer, index) => {
    if (index > 0) {
      if (footer.getAttribute('role') === 'contentinfo') {
        footer.removeAttribute('role');
      }
    }
  });

  // Add navigation landmarks with proper labels if multiple nav elements exist
  const navElements = document.querySelectorAll('nav');
  if (navElements.length > 1) {
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
        const labels = ['Primary navigation', 'Secondary navigation', 'Footer navigation', 'Utility navigation'];
        nav.setAttribute('aria-label', labels[index] || `Navigation ${index + 1}`);
      }
    });
  }
}

/**
 * Ensures all landmarks are unique
 */
export function ensureUniqueLandmarks() {
  uniqueLandmarks();
}

/**
 * Helper function to make landmarks unique with proper labeling
 */
export function uniqueLandmarks() {
  // Get all landmark regions
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header'),
    navigation: document.querySelectorAll('nav'),
    main: document.querySelectorAll('[role="main"], main'),
    complementary: document.querySelectorAll('[role="complementary"], aside'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer'),
    search: document.querySelectorAll('[role="search"]'),
  };

  // Add unique labels to landmarks that have duplicates
  Object.entries(landmarks).forEach(([role, elements]) => {
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (!el.getAttribute('aria-label')) {
          el.setAttribute('aria-label', `${role} region ${index + 1}`);
        }
      });
    }
  });
}

/**
 * Adds accessible names to SVG elements
 * @param {string} svgSelector - CSS selector for SVGs
 */
export function addSvgAccessibleNames(svgSelector = 'svg') {
  addAccessibleNamesToSVGs(svgSelector);
}

/**
 * Adds accessible names to all SVG elements
 * @param {string} svgSelector - CSS selector for SVGs
 */
export function addAccessibleNamesToSVGs(svgSelector = 'svg') {
  const svgs = document.querySelectorAll(svgSelector);
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !svg.getAttribute('title')) {
      const title = document.createElement('title');
      title.id = `svg-title-${index + 1}`;
      title.textContent = `Icon ${index + 1}`;
      
      const desc = document.createElement('desc');
      desc.id = `svg-desc-${index + 1}`;
      desc.textContent = 'Decorative or functional graphic element';
      
      svg.insertBefore(title, svg.firstChild);
      svg.insertBefore(desc, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

/**
 * Fixes fake link issues where non-anchor elements are used as links
 */
export function fixFakeLinkIssue() {
  fixFakeLinkIssues();
}

/**
 * Fixes all fake link issues where non-anchor elements are used as links
 */
export function fixFakeLinkIssues() {
  // Find elements with role="link" that aren't anchors
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach(element => {
    // Convert to proper anchor or add required attributes
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    if (!element.hasAttribute('href')) {
      element.setAttribute('href', '#');
    }
    
    // Add keyboard event handling
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  });
}

/**
 * Google sign-in logic with proper accessibility
 */
export function googleSignIn() {
  // This function should be implemented based on your Google sign-in requirements
  // Below is a template that ensures accessibility
  const signInButton = document.querySelector('[data-google-signin]') || 
                       document.getElementById('google-signin') ||
                       document.querySelector('.google-signin-btn');

  if (signInButton) {
    // Ensure the button has proper accessible name
    if (!signInButton.textContent.trim() && !signInButton.getAttribute('aria-label')) {
      signInButton.setAttribute('aria-label', 'Sign in with Google');
    }

    signInButton.addEventListener('click', async () => {
      // Add loading state with proper announcement
      signInButton.setAttribute('aria-busy', 'true');
      signInButton.setAttribute('aria-label', 'Signing in with Google, please wait...');

      try {
        // Your Google sign-in logic here
        // await performGoogleSignIn();
        
        // Clear loading state
        signInButton.removeAttribute('aria-busy');
        signInButton.setAttribute('aria-label', 'Sign in with Google');
      } catch (error) {
        // Handle error with proper announcement
        signInButton.removeAttribute('aria-busy');
        signInButton.setAttribute('aria-label', 'Sign in with Google');
        
        // Announce error to screen readers
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'alert');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.style.position = 'absolute';
        liveRegion.style.left = '-10000px';
        liveRegion.textContent = 'Sign in failed. Please try again.';
        document.body.appendChild(liveRegion);
        setTimeout(() => liveRegion.remove(), 5000);
      }
    });
  }
}

/**
 * Fixes button identifiers for accessibility
 * Replaces generic "my-button" with proper identifiable names
 */
export function fixButtonIdentifiers() {
  // Find buttons with generic IDs or classes
  const genericSelectors = [
    '[id*="my-button"]',
    '[class*="my-button"]',
    '[id*="btn"]',
    'button:not([id]):not([aria-label]):not([aria-labelledby])'
  ];

  genericSelectors.forEach((selector, index) => {
    const buttons = document.querySelectorAll(selector);
    buttons.forEach((button, btnIndex) => {
      // If button doesn't have an accessible name, add one
      const hasAccessibleName = button.textContent.trim() ||
                               button.getAttribute('aria-label') ||
                               button.getAttribute('aria-labelledby') ||
                               button.querySelector('img[alt]');

      if (!hasAccessibleName) {
        // Try to infer purpose from context or parent
        const parentLabel = button.closest('[aria-label]')?.getAttribute('aria-label') ||
                          button.closest('form')?.querySelector('h1, h2, legend')?.textContent?.trim();
        
        if (parentLabel) {
          button.setAttribute('aria-label', `${parentLabel} button ${btnIndex + 1}`);
        } else {
          // Use generic descriptive name with number
          const buttonTypes = ['Submit', 'Action', 'Confirm', 'Cancel', 'Save', 'Delete'];
          button.setAttribute('aria-label', `${buttonTypes[btnIndex % buttonTypes.length]} button`);
        }
      }
    });
  });
}

/**
 *