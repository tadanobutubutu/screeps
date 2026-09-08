// Main game loop for Screeps (TODO: Existing main.js content before the merge conflict...)

module.exports = {
  loop: function() {
    // Clean up memory of dead creeps
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        delete Memory.creeps[name];
      }
    }

    // Your game logic here
  },
  // Add the following functions
  validateLandmark: validateLandmark,
  fixAccessibleSVGs: fixAccessibleSVGs,
  fixFakeLinks: fixFakeLinks,
  googleSignIn: googleSignIn,

  // Assuming the file is located at ...
};

// TODO: Implement functions to render dependency graphs and display module structure for debugging purposes.

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - Object containing module dependencies
 * @param {Object} options - Configuration options for rendering
 * @returns {string} String representation of the dependency graph
 */
export const renderDependencyGraph = (dependencies = {}, options = {}) => {
  const {
    maxDepth = 3,
    showVersions = false,
    format = 'text'
  } = options;

/**
 * Validates table accessibility
 * @param {Element|null} element - The DOM element to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result
 */
export const validateTableAccessibility = (element) => {
  const errors = [];
  
  if (!element) {
    return { isValid: false, errors: ['No element provided'] };
  }
  
  const validLandmarks = [
    'main',
    'navigation',
    'banner',
    'contentinfo',
    'complementary',
    'search',
    'form',
    'application'
  ];
  
  const role = element.getAttribute('role');
  const ariaLabel = element.getAttribute('aria-label');
  const ariaLabelledby = element.getAttribute('aria-labelledby');
  
  if (!role) {
    errors.push('Landmark element must have a role attribute');
  } else if (!validLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}. Must be one of: ${validLandmarks.join(', ')}`);
  }
  
  // Check for caption
  const caption = element.querySelector('caption');
  if (!caption) {
    errors.push('Table should have a caption for accessibility');
  }
  
  // Check for th elements
  const thElements = element.querySelectorAll('th');
  if (thElements.length === 0) {
    errors.push('Table should have th elements for headers');
  }
  
  // Check for scope attribute on th elements
  thElements.forEach((th, index) => {
    const scope = th.getAttribute('scope');
    if (!scope) {
      errors.push(`th element at index ${index} should have a scope attribute`);
    }
  });
  
  // Check for aria-describedby or aria-label on table
  const ariaLabel = element.getAttribute('aria-label');
  const ariaDescribedby = element.getAttribute('aria-describedby');
  if (!ariaLabel && !ariaDescribedby && !caption) {
    errors.push('Table should have an accessible name (aria-label, aria-describedby, or caption)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates table structure
 * @param {Element|null} element - The DOM element to validate
 * @returns {{ isValid: boolean, errors: string[] }} Validation result
 */
export const validateTableStructure = (element) => {
  const errors = [];
  
  if (!element) {
    return { isValid: false, errors: ['No element provided'] };
  }
  
  if (element.tagName !== 'TABLE') {
    return { isValid: false, errors: ['Element is not a table'] };
  }
  
  // Check for thead
  const thead = element.querySelector('thead');
  if (!thead) {
    errors.push('Table should have a thead element');
  }
  
  // Check for tbody
  const tbody = element.querySelector('tbody');
  if (!tbody) {
    errors.push('Table should have a tbody element');
  }
  
  // Check proper nesting of tr within thead/tbody/tfoot
  const rows = element.querySelectorAll('tr');
  rows.forEach((row, index) => {
    const parent = row.parentElement;
    if (parent && parent.tagName !== 'THEAD' && parent.tagName !== 'TBODY' && parent.tagName !== 'TFOOT') {
      errors.push(`tr element at index ${index} should be nested within thead, tbody, or tfoot`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Add accessible names to SVGs
export const fixAccessibleSVGs = (container = document) => {
  const svgs = container.querySelectorAll('svg:not([aria-hidden="true"])');
  
  svgs.forEach((svg) => {
    const parent = svg.parentElement;
    const existingLabel = parent?.querySelector('span.sr-only, [class*="visually-hidden"]');
    
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby') && !existingLabel) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        // Generate a descriptive label based on context
        const contextText = parent?.textContent?.trim() || 'Decorative graphic';
        svg.setAttribute('aria-label', contextText);
      }
    }
  });
  
  return svgs.length;
};

// Fix fake link issue - ensure elements that look like links are properly accessible
export const fixFakeLinks = (container = document) => {
  const fakeLinks = container.querySelectorAll('[role="button"], [onclick], a:not([href])');
  
  fakeLinks.forEach((element) => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    
    // Ensure proper role for non-anchor elements
    if (!isAnchor && element.getAttribute('role') !== 'button') {
      element.setAttribute('role', 'button');
    }
    
    // Add tabindex if not already present and not naturally focusable
    if (!element.hasAttribute('tabindex') && !['a', 'button', 'input', 'select', 'textarea'].includes(tagName)) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard event handlers if missing
    if (!element.hasAttribute('onKeyDown')) {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          element.click();
        }
      });
    }
  });
  
  return fakeLinks.length;
};

// REACT_015: Add lang attribute
export const addLangAttribute = (element, lang) => {
  if (element) {
    element.setAttribute('lang', lang);
  }
  return element;
};

// Implement Google sign-in logic
export const googleSignIn = () => {
  return new Promise((resolve, reject) => {
    // Check if Google API is available
    if (typeof google === 'undefined' || !google.accounts) {
      reject(new Error('Google API not loaded'));
      return;
    }
    
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      scope: 'profile email',
      callback: (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error));
        } else {
          // Fetch user profile with the access token
          fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
              'Authorization': `Bearer ${tokenResponse.access_token}`
            }
          })
            .then((res) => res.json())
            .then((user) => resolve(user))
            .catch(reject);
        }
      }
    });
    
    client.requestAccessToken();
  });
};

const Dashboard = (props) => {