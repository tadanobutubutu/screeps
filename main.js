// main.js - Accessibility Fixed Version with additional improvements

export function MainContent({ children, className = '' }) {
  // ... existing code ...
}

export function Navigation({ items = [], ariaLabel = 'Main navigation' }) {
  // ... existing code ...
}

export function AccessibleTable({ headers = [], rows = [], caption }) {
  // ... existing code ...
}

export function AccessibleIcon({ icon: Icon, label, className = '' }) {
  // ... existing code ...
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  ariaLabel,
  disabled = false,
  type = 'button'
}) {
  // ... existing code ...
}

export function AccessibleLink({
  children,
  href,
  ariaLabel,
  className = ''
}) {
  // ... existing code ...
}

export function PageLayout({
  children,
  sidebar,
  navigation
}) {
  // ... existing code ...
}

export function setLanguageAttribute() {
  // Ensure the html element has a lang attribute
  if (typeof document !== 'undefined') {
    const htmlElement = document.querySelector('html');
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', 'en'); // Default to English
    }
  }
}

export function enhanceTableAccessibility(tableElement) {
  if (!tableElement) return;

  // Add proper table structure if missing
  if (!tableElement.querySelector('thead') && tableElement.querySelector('th')) {
    const thead = document.createElement('thead');
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      firstRow.parentNode.insertBefore(thead, firstRow);
      thead.appendChild(firstRow);
    }
  }

  // Add scope attributes to headers if needed
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

export function ensureLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure main content has a landmark
  if (!document.querySelector('main, [role="main"]')) {
    const mainContent = document.querySelector('article, div[role="main"]');
    if (mainContent) {
      mainContent.setAttribute('role', 'main');
    }
  }

  // Ensure navigation has a landmark
  if (!document.querySelector('nav, [role="navigation"]')) {
    const navElement = document.querySelector('ul.nav, div.navigation');
    if (navElement) {
      navElement.setAttribute('role', 'navigation');
    }
  }
}

export function makeSvgAccessible(svgElement) {
  if (!svgElement || svgElement.getAttribute('aria-hidden') === 'true') return;

  // Add title if SVG doesn't have accessible name
  if (!svgElement.querySelector('title, text[aria-label], text[aria-labelledby]')) {
    const title = document.createElement('title');
    title.textContent = 'Decorative graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

export function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  // Ensure navigation landmarks are unique
  const navLandmarks = document.querySelectorAll('[role="navigation"]');
  if (navLandmarks.length > 1) {
    navLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.setAttribute('aria-label', `Navigation ${index + 1}`);
      }
    });
  }

  // Ensure main landmarks are unique
  const mainLandmarks = document.querySelectorAll('[role="main"]');
  if (mainLandmarks.length > 1) {
    mainLandmarks.forEach((landmark, index) => {
      if (index > 0) {
        landmark.setAttribute('aria-label', `Main content ${index + 1}`);
      }
    });
  }
}

export function makeLinksAccessible() {
  if (typeof document === 'undefined') return;

  // Find elements that look like links but aren't
  const fakeLinks = document.querySelectorAll('[role="button"], [role="link"], [tabindex="0"]');
  fakeLinks.forEach(element => {
    if (element.tagName !== 'A' && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', element.textContent.trim());
    }
  });
}

// Initialize accessibility improvements when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setLanguageAttribute();
    ensureLandmarks();
    ensureUniqueLandmarks();
    makeLinksAccessible();

    // Apply to existing tables and SVGs
    document.querySelectorAll('table').forEach(enhanceTableAccessibility);
    document.querySelectorAll('svg').forEach(makeSvgAccessible);
  });
}

// Preserve all existing exports and functions from the original main.js
export default {
  MainContent,
  Navigation,
  AccessibleTable,
  AccessibleIcon,
  AccessibleButton,
  AccessibleLink,
  PageLayout
};