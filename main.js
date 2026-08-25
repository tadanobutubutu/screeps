// Import required module(s) for addressing the new issue
import { getElementById } from './helpers.js';
export { getElementById };

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
    const headers = firstRow ? firstRow.querySelectorAll('th') : [];
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
    const fallbackMain = document.getElementById('main') || document.querySelector('[role="main"]') || document.querySelector('.main') || document.querySelector('#content');
    if (fallbackMain) {
      const newMain = document.createElement('main');
      newMain.innerHTML = fallbackMain.innerHTML;
      while (fallbackMain.firstChild) {
        newMain.appendChild(fallbackMain.firstChild);
      }
      fallbackMain.parentNode.replaceChild(newMain, fallbackMain);
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

  const primaryContent = getElementById('content') || document.getElementById('main') || document.querySelector('[role="main"]') || document.querySelector('.main') || document.querySelector('.content');
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
    const role = child.getAttribute('role') || tagName;
    return !landmarkTags.includes(role) && !landmarkRoles.includes(role);
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

  const landmarks = document.querySelectorAll('header, footer, aside, section');
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
    if (!svg.getAttribute('role') && title) {
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

  const links = document.querySelectorAll('a[href="#"]');
  links.forEach((link) => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
    }
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const srcElement = e.srcElement || e.target;
      const target = srcElement.hash;
      const dest = target ? document.querySelector(target) : null;

      if (dest) {
        // Set focus on the target element
        dest.focus();
        // Scroll to the target position
        scrollTo({ top: dest.offsetTop, behavior: 'smooth' });
      }
    });
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

  const landmarkTags = ['header', 'footer', 'main', 'nav', 'aside'];
  const landmarkRoles = ['banner', 'contentinfo', 'main', 'navigation', 'complementary'];

 // Check if there is already a navigation landmark
  const existingNav = document.querySelector('nav, [role="navigation"]');
  if (!existingNav) {
    // Try to find a nav element or create one around navigation links
    const navLinks = document.querySelectorAll('a[href*="/"]');
    if (navLinks.length > 0) {
      const nav = document.createElement('nav');
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Main Navigation');
      const parent = navLinks[0].parentNode;
      const container = parent || body;
      container.parentNode.insertBefore(nav, container);
      while (nav.nextSibling && nav.nextSibling.textContent ? nav.nextSibling.textContent.trim() : '') {
        nav.appendChild(nav.nextSibling);
      }
    }
  }

 // Check if there is already a complementary landmark
  const existingAside = document.querySelector('aside, [role="complementary"]');
  if (!existingAside) {
    const asideElements = document.querySelectorAll('.sidebar, .aside, .complementary');
    if (asideElements.length > 0) {
      const aside = document.createElement('aside');
      aside.setAttribute('role', 'complementary');
      const parent = asideElements[0].parentNode;
      const container = parent || body;
      container.parentNode.insertBefore(aside, container);
      while (aside.nextSibling && aside.nextSibling.textContent ? aside.nextSibling.textContent.trim() : '') {
        aside.appendChild(aside.nextSibling);
      }
    }
  }
}

addLangAttribute();
fixTableStructure();
addMainLandmark();
ensureUniqueLandmarks();
fixFakeLinks();