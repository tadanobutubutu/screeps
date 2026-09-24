// TODO: This is the existing code that needs to be preserved

// Accessibility fixes from insight report

// REACT_015: Add lang attribute to document
export function ensureLangAttribute() {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (!htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en');
    }
  }
}

// REACT_040: Replace my-button with actual button id for accessibility
export function fixButtonIds() {
  if (typeof document !== 'undefined') {
    const myButton = document.getElementById('my-button');
    if (myButton) {
      myButton.id = 'main-action-button';
      myButton.setAttribute('aria-label', 'Main action');
    }
  }
}

// REACT_042: Ensure dependencyGraph container has proper ARIA role
export function ensureDependencyGraphARIA() {
  if (typeof document !== 'undefined') {
    const container = document.querySelector('.dependencyGraph, #dependencyGraph, [data-dependency-graph]');
    if (container && !container.hasAttribute('role')) {
      container.setAttribute('role', 'region');
      container.setAttribute('aria-label', 'Dependency graph visualization');
    }
  }
}

// REACT_041: Add accessible names to SVGs
export function addSVGAccessibleNames() {
  if (typeof document !== 'undefined') {
    const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
    svgs.forEach((svg, index) => {
      const title = svg.querySelector('title');
      if (title) {
        const id = `svg-title-${index}`;
        title.id = id;
        svg.setAttribute('aria-labelledby', id);
      } else {
        svg.setAttribute('aria-label', `Graphic element ${index + 1}`);
      }
    });
  }
}

// REACT_036: Fix fake link issues (links without href that behave like buttons)
export function fixFakeLinks() {
  if (typeof document !== 'undefined') {
    const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
    fakeLinks.forEach(link => {
      if (link.getAttribute('href') === '#' || !link.hasAttribute('href')) {
        link.setAttribute('role', 'button');
        link.setAttribute('tabindex', '0');
      }
    });
  }
}

// REACT_017: Add/fix landmark issues
export function ensureLandmarks() {
  if (typeof document !== 'undefined') {
    // Ensure main landmark exists
    let main = document.querySelector('main, [role="main"]');
    if (!main) {
      main = document.createElement('main');
      document.body.insertBefore(main, document.body.firstChild);
    }
    
    // Ensure nav landmark has label
    const navs = document.querySelectorAll('nav');
    navs.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
    
    // Ensure header has proper landmark
    const header = document.querySelector('header:not([role]), [role="banner"]');
    if (header && !header.id) {
      header.id = 'site-header';
    }
    
    // Ensure footer has proper landmark
    const footer = document.querySelector('footer:not([role]), [role="contentinfo"]');
    if (footer && !footer.id) {
      footer.id = 'site-footer';
    }
  }
}

// REACT_025: Ensure unique landmarks
export function ensureUniqueLandmarks() {
  if (typeof document !== 'undefined') {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="contentinfo"], [role="main"], [role="complementary"], [role="search"]');
    const counts = {};
    
    landmarks.forEach(landmark => {
      const role = landmark.getAttribute('role');
      counts[role] = (counts[role] || 0) + 1;
      
      if (counts[role] > 1 && !landmark.hasAttribute('aria-label')) {
        landmark.setAttribute('aria-label', `${role} section ${counts[role]}`);
      }
    });
  }
}

// REACT_027: Fix table structure issues
export function fixTableStructure() {
  if (typeof document !== 'undefined') {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
      // Ensure tables have proper structure
      if (!table.querySelector('thead')) {
        const firstRow = table.querySelector('tr');
        if (firstRow) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow.cloneNode(true));
          table.insertBefore(thead, table.firstChild);
          firstRow.remove();
        }
      }
      
      // Ensure tables have captions or summaries
      if (!table.querySelector('caption') && !table.getAttribute('aria-label') && !table.getAttribute('aria-describedby')) {
        const caption = document.createElement('caption');
        caption.textContent = 'Data table';
        table.insertBefore(caption, table.firstChild);
      }
      
      // Ensure th elements have scope
      const headers = table.querySelectorAll('th');
      headers.forEach(th => {
        if (!th.hasAttribute('scope')) {
          const row = th.closest('tr');
          if (row && row.parentElement.tagName === 'THEAD') {
            th.setAttribute('scope', 'col');
          } else {
            th.setAttribute('scope', 'row');
          }
        }
      });
    });
  }
}

// REACT_037: Google sign-in logic
export function initGoogleSignIn() {
  if (typeof window !== 'undefined' && window.google) {
    window.google.accounts.id.initialize({
      client_id: window.GOOGLE_CLIENT_ID || '',
      callback: handleGoogleResponse,
      auto_select: false
    });
    
    const buttonContainer = document.getElementById('google-signin-button');
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular'
      });
    }
  }
}

function handleGoogleResponse(response) {
  if (typeof window !== 'undefined' && window.handleAuthResponse) {
    window.handleAuthResponse(response);
  }
}

// Initialize all accessibility fixes
export function initAccessibility() {
  ensureLangAttribute();
  fixButtonIds();
  ensureDependencyGraphARIA();
  addSVGAccessibleNames();
  fixFakeLinks();
  ensureLandmarks();
  ensureUniqueLandmarks();
  fixTableStructure();
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}