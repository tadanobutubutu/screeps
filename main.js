// Import required module(s) for addressing the new issue
import { getElementId } from './helpers.js';
export { getElementId };

// TODO: Implement the new function as per the issue requirements
function newIssueFunction() {
  if (typeof document === 'undefined') return;

  const elements = document.querySelectorAll('p');
  elements.forEach((element) => {
    // Replace with your custom logic for the new issue
    element.textContent = 'Replaced Text';
  });
}

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute() {
  if (typeof document === 'undefined') return;

  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = 'en';
  }
}

/**
 * REACT_027: Fix table structure issues
 * Add scope="col" or scope="row" to <th> elements so assistive technologies can associate headers
 */
function fixTableStructure() {
  if (typeof document === 'undefined') return;

  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const firstRow = table.querySelector('tr');
    const headers = firstRow ? Array.from(firstRow.querySelectorAll('th')) : [];
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const isInThead = !!th.closest('thead');
        const isFirstRow = firstRow && row === firstRow;
        if (isInThead || isFirstRow) {
          th.setAttribute('scope', 'col');
        } else {
          th.setAttribute('scope', 'row');
        }
      }
    });
  });
}

/**
 * REACT_017: Add/fix landmark issues - add main landmark
 */
function addMainLandmark() {
  if (typeof document === 'undefined') return;

  const mains = document.querySelectorAll('main');
  if (mains.length === 0) {
    const fallbackMain = document.querySelector('[role="main"]') || document.querySelector('#main') || document.querySelector('.main') || document.querySelector('#content');
    if (fallbackMain) {
      const newMain = document.createElement('main');
      newMain.innerHTML = fallbackMain.innerHTML;
      while (fallbackMain.firstChild) {
        fallbackMain.removeChild(fallbackMain.firstChild);
      }
      fallbackMain.appendChild(newMain);
      if (fallbackMain.tagName !== 'MAIN') {
        try {
          const newMainElement = document.createElement('main');
          newMainElement.innerHTML = fallbackMain.innerHTML;
          while (fallbackMain.firstChild) {
            fallbackMain.removeChild(fallbackMain.firstChild);
          }
          fallbackMain.parentNode.replaceChild(newMainElement, fallbackMain);
        } catch (e) {
          // Preserve existing structure if tag change fails
        }
      }
    }
  }

  const headers = document.querySelectorAll('header');
  if (headers.length === 1) {
    const header = headers[0];
    if (!header.getAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
  }

  const footers = document.querySelectorAll('footer');
  if (footers.length === 1) {
    const footer = footers[0];
    if (!footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
  }
}

/**
 * Wrap primary content in a main landmark element
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined') return;

  const existingMains = document.querySelectorAll('main');
  if (existingMains.length > 0) {
    return;
  }

  const primaryContent = getElementId('content') || document.querySelector('[role="main"]') || document.querySelector('#main') || document.querySelector('.main') || document.body;
  if (primaryContent) {
    const main = document.createElement('main');
    if (primaryContent.parentNode) {
      primaryContent.parentNode.insertBefore(main, primaryContent);
      main.appendChild(primaryContent);
    }
    return;
  }

  const body = document.body;
  if (!body) return;

  const landmarkTags = ['header', 'footer', 'nav', 'aside'];
  const landmarkRoles = ['banner', 'contentinfo', 'navigation', 'complementary'];
  const children = Array.from(body.children);
  const primaryChildren = children.filter((child) => {
    const tag = child.tagName ? child.tagName.toLowerCase() : '';
    const role = child.getAttribute('role') || tag;
    return !landmarkTags.includes(tag) && !landmarkRoles.includes(role);
  });

  if (primaryChildren.length > 0) {
    const main = document.createElement('main');
    body.insertBefore(main, body.firstChild);
    primaryChildren.forEach((child) => {
      if (child.parentNode === body) {
        main.appendChild(child);
      }
    });
  }
}

/**
 * REACT_025: Ensure unique landmarks
 * Ensures each landmark has a unique accessible name
 */
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') return;

  const landmarks = document.querySelectorAll('header, footer, main, nav, aside, section');
  const landmarkLabels = new Map();

  landmarks.forEach((landmark) => {
    let label = landmark.getAttribute('aria-label') || landmark.getAttribute('aria-labelledby') || null;

    const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
    const role = landmark.getAttribute('role') || tagName;

    if (!label) {
      const count = landmarkLabels.get(role) || 0;

      const defaultLabels = {
        'nav': ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'],
        'main': ['Main Content'],
        'header': ['Site Header', 'Page Header'],
        'footer': ['Site Footer', 'Page Footer'],
        'aside': ['Sidebar', 'Related Content'],
        'section': ['Section']
      };

      const roleLabels = defaultLabels[role] || ['Section'];
      label = roleLabels[count] || role.charAt(0).toUpperCase() + role.slice(1) + ' ' + (count + 1);

      landmark.setAttribute('aria-label', label);
    } else {
      const count = landmarkLabels.get(label) || 0;

      if (landmarkLabels.get(label) > 1) {
        const newLabel = `${label} (${count + 1})`;
        landmark.setAttribute('aria-label', newLabel);
      }
    }

    landmarkLabels.set(role, (landmarkLabels.get(role) || 0) + 1);
    landmarkLabels.set(label, (landmarkLabels.get(label) || 0) + 1);
  });

  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label')) {
      const navLabels = ['Main Navigation', 'Secondary Navigation', 'Footer Navigation', 'Sidebar Navigation'];
      nav.setAttribute('aria-label', navLabels[index] || 'Navigation ' + (index + 1));
    }
  });
}

/**
 * REACT_041: Add accessible names to SVGs
 */
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') return;

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const titleId = 'svg-title-' + (index + 1);
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = titleId;
      title.textContent = 'SVG graphic ' + (index + 1);
      svg.insertBefore(title, svg.firstChild);
    } else {
      if (!title.id) {
        title.id = titleId;
      }
    }
    if (svg.getAttribute('role') === 'img' && title) {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

/**
 * REACT_036: Fix 1 fake link issue
 */
function fixFakeLinks() {
  if (typeof document === 'undefined') return;

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    const href = link.getAttribute('href');
    // Identify fake links: missing href, empty href, or just "#"
    if (!href || href === '' || href === '#') {
      // Create a button element to replace the fake link
      const button = document.createElement('button');
      // Copy all attributes except href
      Array.from(link.attributes).forEach((attr) => {
        if (attr.name !== 'href') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      // Preserve the inner content
      button.innerHTML = link.innerHTML;
      // Ensure the button has type="button"
      button.type = 'button';
      // If the original anchor had a hash, store it for scrolling
      const hash = link.hash;
      if (hash) {
        button.setAttribute('data-target', '#' + hash);
      }
      // Replace the anchor with the button
      link.parentNode.replaceChild(button, link);

      // Attach click handler to the new button to scroll to the target
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const target = button.getAttribute('data-target');
        if (target) {
          const dest = document.querySelector(target);
          if (dest) {
            dest.focus();
            window.scrollTo({ top: dest.offsetTop, behavior: 'smooth' });
          }
        }
      });
    }
  });
}

/**
 * REACT_018: Properly establish landmark regions for accessibility
 * Ensures all necessary landmark elements are present and correctly configured
 */
function establishLandmarkRegions() {
  if (typeof document === 'undefined') return;

  const body = document.body;
  if (!body) return;

  const landmarkTags = ['header', 'footer', 'main', 'nav', 'aside', 'section', 'article', 'form', 'search'];
  
  // Ensure each landmark type exists at least once
  landmarkTags.forEach(tag => {
    const elements = body.getElementsByTagName(tag);
    if (elements.length === 0) {
      // Create missing landmark if necessary
      const landmark = document.createElement(tag);
      // Add appropriate ARIA role based on tag
      const roleMap = {
        'header': 'banner',
        'footer': 'contentinfo',
        'main': 'main',
        'nav': 'navigation',
        'aside': 'complementary',
        'section': 'region',
        'article': 'article',
        'form': 'form',
        'search': 'search'
      };
      if (roleMap[tag]) {
        landmark.setAttribute('role', roleMap[tag]);
      }
      // Insert at appropriate location
      if (tag === 'main') {
        body.insertBefore(landmark, body.firstChild);
      } else {
        body.appendChild(landmark);
      }
    }
  });

  // Ensure proper nesting and structure
  const main = body.querySelector('main') || body.querySelector('[role="main"]');
  if (main) {
    // Move main content to be after header but before footer
    const header = body.querySelector('header');
    const footer = body.querySelector('footer');
    if (header && footer) {
      header.parentNode.insertBefore(main, header.nextSibling);
      footer.parentNode.insertBefore(footer, main.nextSibling);
    }
  }
}