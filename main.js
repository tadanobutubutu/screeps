import React from 'react';
import ReactDOM from 'react-dom/client';

const renderDependencyGraph = (dependencyGraph, container) => {
  const graphContent = dependencyGraphContent;
  container.innerHTML = graphContent;
};

const addressAccessibilityIssue038 = (element, accessibilityInfo) => {
  console.log(`Addressing accessibility issue for ${element} with info:`, accessibilityInfo);
};

function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en-US';
}

function createInPageButton(label, targetId) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', () => {
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
  return button;
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    const caption = table.querySelector('caption');
    if (!caption) {
      const cap = document.createElement('caption');
      cap.textContent = `Table ${index + 1}`;
      table.insertBefore(cap, table.firstChild);
    }

    const thInHeader = table.querySelectorAll('thead th');
    if (thInHeader.length === 0) {
      const firstRow = table.querySelector('tr');
      if (firstRow && firstRow.children.length > 0) {
        Array.from(firstRow.children).forEach(cell => {
          const th = document.createElement('th');
          th.setAttribute('scope', 'col');
          th.textContent = cell.textContent;
          cell.parentNode.replaceChild(th, cell);
        });
      }
    }
  });
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const headerRow = table.querySelector('tr');
      if (headerRow) {
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        
        if (rows.length > 1) {
          thead.appendChild(rows[0]);
          rows.slice(1).forEach(row => {
            tbody.appendChild(row);
          });
          table.appendChild(thead);
          table.appendChild(tbody);
        }
      }
    }
  });
}

function validateLandmark(element, landmarkType) {
  if (!element.hasAttribute('aria-' + landmarkType)) {
    throw new Error(`Element '${element.outerHTML}' is not a valid ${landmarkType} landmark`);
  }
}

function validateLandmarkStructure() {
  const mainLandmark = document.querySelector('[role="main"], main');
  if (!mainLandmark) {
    throw new Error('Document must have a main landmark (role="main" or <main> element)');
  }

  const banners = document.querySelectorAll('[role="banner"], [role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }

  const contentinfos = document.querySelectorAll('[role="contentinfo"], [role="footer"]');
  if (contentinfos.length > 1) {
    throw new Error('Document should have at most one contentinfo or footer landmark');
  }

  const allLandmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"], [role="article"], [role="aside"], [role="figure"], [role="footer"], [role="header"], [role="landmark"], main, header, footer, aside, nav, section[aria-label], form[aria-label]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    let parent = landmark.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('role') || parent.tagName.toLowerCase();
      if (parentRole === role) {
        throw new Error(`Landmark with role "${role}" should not be nested inside another with the same role`);
      }
      parent = parent.parentElement;
    }
  });
}

function getSvgAccessibleName(svgElement) {
  if (svgElement.hasAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  if (svgElement.hasAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent.trim());
      }
    });
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }
  return svgElement.textContent.trim() || 'Image description';
}

function setSvgAttributes(svg) {
  svg.setAttribute('role', 'img');
  
  const accessibleName = getSvgAccessibleName(svg);
  svg.setAttribute('aria-label', accessibleName);
  
  const title = svg.querySelector('title');
  const titleId = `svg-title-${Math.floor(Math.random() * 1000)}`;
  
  if (!title) {
    const newTitle = document.createElement('title');
    newTitle.id = titleId;
    newTitle.textContent = accessibleName;
    svg.insertBefore(newTitle, svg.firstChild);
  } else if (!title.id) {
    title.id = titleId;
  }
  
  svg.setAttribute('aria-labelledby', titleId);
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"], main, nav, header, footer, aside');
  const landmarkTypes = {};
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (!landmarkTypes[role]) {
      landmarkTypes[role] = 0;
    }
    landmarkTypes[role]++;
    
    if (landmarkTypes[role] > 1) {
      landmark.setAttribute('aria-label', `${role} ${landmarkTypes[role]}`);
    } else if (!landmark.getAttribute('aria-label') && !landmark.getAttribute('aria-labelledby')) {
      landmark.setAttribute('aria-label', role);
    }
  });
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('href')) {
      link.setAttribute('href', '#');
      link.setAttribute('aria-label', link.textContent || 'Link');
    } else if (!link.textContent.trim()) {
      link.setAttribute('aria-label', 'Link');
    }
  });
}

function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('[data-fake-link], .fake-link, [role="link"]');
  fakeLinks.forEach(fakeLink => {
    const text = fakeLink.textContent || fakeLink.getAttribute('aria-label') || 'Link';
    fakeLink.setAttribute('role', 'link');
    fakeLink.setAttribute('tabindex', '0');
    fakeLink.setAttribute('aria-label', text);
    
    fakeLink.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fakeLink.click();
      }
    });
  });
}

function addProperLandmarkRegions() {
  const mainContent = document.querySelector('main, [role="main"]');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }
  
  const navigation = document.querySelector('nav, [role="navigation"]');
  if (navigation && !navigation.id) {
    navigation.id = 'navigation';
  }
  
  const banner = document.querySelector('header, [role="banner"]');
  if (banner && !banner.id) {
    banner.id = 'banner';
  }
  
  const contentInfo = document.querySelector('footer, [role="contentinfo"]');
  if (contentInfo && !contentInfo.id) {
    contentInfo.id = 'contentinfo';
  }
}

function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
}

let funcNames = [];

// TODO: Add back any required exports that might have been removed.
// For example, if the issue requires adding back an export like `calculateSum`, you would add:
// export function calculateSum(a, b) { return a + b; }

var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

function countDependencies(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count += countDependencies(obj[key]);
    } else if (typeof obj[key] === 'function') {
      let funcName = obj[key].name || '<anonymous>';
      if (!funcNames.includes(funcName)) {
        funcNames.push(funcName);
        count++;
      }
    }
  }
  return count;
}

function MainApp() {
  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><button type="button" onClick={() => {}} aria-label="Contact">Contact</button></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content" role="main" tabIndex={-1}>
        <h1>Welcome</h1>
        <p>This is the main content area.</p>
      </main>
      
      <footer role="contentinfo">
        <p>&copy; 2024 Company Name</p>
      </footer>
    </div>
  );
}

function handleSkipLinkClick() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.focus();
  }
}

function renderDependencyGraphs(dependencies) {
  // existing function implementation
}

function myNewFunction(input) {
  // Implement the new function here
}

function main() {
  return 'Hello World';
}

function SomeClass() {}

function someUtility() {
  return true;
}

const config = {
  enabled: true
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainApp />);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

mainElement.appendChild(document.body.cloneNode(true));
document.body.parentNode.insertBefore(mainElement, document.body);

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Standalone utility function to check if user prefers reduced motion
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Standalone utility function to check if user prefers high contrast
export function prefersHighContrast() {
  return window.matchMedia('(prefers-contrast: more)').matches;
}

// Restored function to wrap primary content in a <main> element (required export)
function wrapPrimaryContentInMain() {
  const mainElement = document.createElement('main');
  mainElement.setAttribute('lang', document.documentElement.lang);

  // Ensure html lang attribute
  if (!document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }

  mainElement.appendChild(document.body.cloneNode(true));
  document.body.parentNode.insertBefore(mainElement, document.body);
}

function validateLandmark(element) {
  element.setAttribute('role', 'banner');
}

document.addEventListener('DOMContentLoaded', () => {
  validateTableAccessibility();
  validateTableStructure();
  document.querySelectorAll('svg').forEach(setSvgAttributes);
  ensureUniqueLandmarks();
  validateLinkAccessibility();
  handleFakeLinks();
  addProperLandmarkRegions();
  validateLandmarkStructure();
});

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  reverseString,
  isEven,
  capitalizeFirst,
  a11yStore,
  addressAccessibilityIssues,
  updateLiveRegion: a11yStore.updateLiveRegion,
  checkLandmarkElements: a11yStore.checkLandmarkElements,
  addSVGAccessibilityProps: a11yStore.addSVGAccessibilityProps,
  preserveExistingCode: a11yStore.preserveExistingCode,
  prefersReducedMotion: a11yStore.prefersReducedMotion,
  prefersHighContrast: a11yStore.prefersHighContrast,
  getLangAttribute,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  validateLinkAccessibility,
  handleFakeLinks,
  addProperLandmarkRegions,
  validateLandmarkStructure,
  validateLandmark,
  addLangAttribute
};

export { a11yStore };
export { addressAccessibilityIssues };
export { updateLiveRegion };
export { checkLandmarkElements };
export { addSVGAccessibilityProps };
export { preserveExistingCode };
export { prefersReducedMotion };
export { prefersHighContrast };
export { getLangAttribute };
export { createInPageButton };
export { validateTableAccessibility };
export { validateTableStructure };
export { getSvgAccessibleName };
export { setSvgAttributes };
export { ensureUniqueLandmarks };
export { validateLinkAccessibility };
export { handleFakeLinks };
export { addProperLandmarkRegions };
export { validateLandmarkStructure };
export { validateLandmark };
export { addLangAttribute };
export { wrapPrimaryContentInMain };
export default a11yStore;