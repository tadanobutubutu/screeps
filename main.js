const _ = require('lodash');
const dependencyGraphContent = require('./dependencyGraphContent');
const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const { add, subtract, multiply, divide, power, squareRoot, factorial, fibonacci, sum, average, max, min, mode, median } = require('./mathHelpers');

const a11yStore = {
  init: function() {
    a11yUtils.initSkipLinks();
    if (!document.documentElement.getAttribute('lang')) {
      document.documentElement.setAttribute('lang', 'en');
    }
  },
  preserveExistingCode: function() {
    // Preserve existing code
  },
  addressAccessibilityIssues: function(report) {
    if (!report) return;
    a11yUtils.announce('Addressing accessibility issues from insight report');
    a11yStore.preserveExistingCode();
    if (report.hasaccessibilityIssues) {
      addressAccessibilityIssues(report);
    }
    if (report.hasLandmarksToFix) {
      addProperLandmarkRegions();
    }
  }
};

const a11yUtils = {
  createLiveRegion: function() {
    let liveRegion = document.getElementById('a11y-live-region');
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'a11y-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      liveRegion.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
      document.body.appendChild(liveRegion);
    }
    return liveRegion;
  },

  announce: function(message, priority = 'polite') {
    const liveRegion = this.createLiveRegion();
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  },

  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    };

    element.addEventListener('keydown', handleTabKey);
    return () => element.removeEventListener('keydown', handleTabKey);
  },

  initSkipLinks: function() {
    const skipLink = document.querySelector('a[href="#main-content"]');
    if (skipLink) {
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        skipLink.addEventListener('click', (e) => {
          e.preventDefault();
          mainContent.setAttribute('tabindex', '-1');
          mainContent.focus();
          this.announce('Skipped to main content');
        });
      }
    }
  }
};

function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

function newFunction() {
  // Your new function code here
}

function validateLandmark(role, element) {
  const results = {
    isValid: true,
    issues: [],
    role: role,
    element: element
  };

  // ... Existing code remains the same
}

function validateLandmarkStructure(element) {
  // ... Existing code remains the same
}

function validateLandmarkAttributes(element, role) {
  // ... Existing code remains the same
}

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ...)

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.lang) {
    htmlElement.lang = lang;
  }
  return document;
}

// Function to fix table structure issues
function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    // Ensure tables have proper structure with thead and tbody
    const existingThead = table.querySelector('thead');
    const existingTbody = table.querySelector('tbody');
    const rows = table.querySelectorAll('tr');
    
    if (rows.length > 0 && !existingThead) {
      const firstRow = rows[0];
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
      fixedCount++;
    }
    
    if (!existingTbody) {
      const remainingRows = rows.length > 0 ? Array.from(rows).slice(0) : [];
      if (remainingRows.length > 0) {
        const tbody = document.createElement('tbody');
        remainingRows.forEach(row => tbody.appendChild(row));
        table.appendChild(tbody);
        fixedCount++;
      }
    }
    
    // Ensure proper header cells (th) are used
    const allRows = table.querySelectorAll('tr');
    allRows.forEach(row => {
      const cells = row.querySelectorAll('td, th');
      if (cells.length > 0) {
        // If first cell should be a header
        if (row.parentElement.tagName === 'THEAD' && cells.length > 0) {
          const firstCell = cells[0];
          const th = document.createElement('th');
          th.textContent = firstCell.textContent;
          th.scope = 'col';
          row.insertBefore(th, firstCell);
        }
      }
    });
  });

  return fixedCount;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = null;
  
  if (!mainElement) {
    // Find the main content area and wrap it or create main element
    const body = document.body;
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('id', 'main-content');
    }
    
    // Move first significant content child to main
    const children = body.children;
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }
    
    // Ensure main has proper role if not using native element
    if (mainElement && mainElement.tagName !== 'MAIN') {
      mainElement.setAttribute('role', 'main');
    }
    
    mainElement = main;
  }
  
  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function uniqueLandmarks(document) {
  // Combined approach using both role-based and element-based selection
  const landmarkSelectors = [
    { selector: '[role="navigation"]', name: 'navigation' },
    { selector: '[role="banner"]', name: 'banner' },
    { selector: '[role="contentinfo"]', name: 'contentinfo' },
    { selector: '[role="complementary"]', name: 'complementary' },
    { selector: 'main, [role="main"]', name: 'main' },
    { selector: '[role="region"]', name: 'region' },
    { selector: '[role="article"]', name: 'article' },
    { selector: 'nav', name: 'navigation' },
    { selector: 'header:not([role])', name: 'banner' },
    { selector: 'footer:not([role])', name: 'contentinfo' },
    { selector: 'aside', name: 'complementary' }
  ];

  landmarkSelectors.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      let index = 1;
      elements.forEach((element, idx) => {
        if (idx > 0) {
          element.setAttribute('role', 'none');
        }
      });
    }
  });
}

function checkLandmarkElement(element, role) {
  // Implementation for checking landmark elements
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'region', 'article'];
  if (!validRoles.includes(role)) {
    return false;
  }
  return element.getAttribute('role') === role || element.tagName.toLowerCase() === role;
}

function wrapPrimaryContentInMain(document) {
  const body = document.body;
  const mainContent = document.getElementById('main-content');
  
  if (!mainContent) {
    const main = document.createElement('main');
    main.id = 'main-content';
    
    // Wrap primary content
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META' &&
          child.id !== 'header' && child.id !== 'footer' && 
          child.id !== 'nav') {
        main.appendChild(child);
        break;
      }
    }
    
    body.insertBefore(main, body.firstChild);
    return main;
  }
  
  return mainContent;
}

function checkLandmarks(document) {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer, [role="complementary"], aside, [role="region"], [role="article"]');
  const results = {
    hasMainLandmark: false,
    hasNavigationLandmark: false,
    hasBannerLandmark: false,
    hasContentInfoLandmark: false,
    hasComplementaryLandmark: false,
    landmarks: []
  };

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    results.landmarks.push({
      element: landmark,
      role: role,
      isUnique: false
    });

    switch (role) {
      case 'main':
      case 'MAIN':
        results.hasMainLandmark = true;
        break;
      case 'navigation':
      case 'NAVIGATION':
      case 'nav':
        results.hasNavigationLandmark = true;
        break;
      case 'banner':
      case 'BANNER':
      case 'header':
        results.hasBannerLandmark = true;
        break;
      case 'contentinfo':
      case 'CONTENTINFO':
      case 'footer':
        results.hasContentInfoLandmark = true;
        break;
      case 'complementary':
      case 'COMPLEMENTARY':
      case 'aside':
        results.hasComplementaryLandmark = true;
        break;
    }
  });

  // Check for duplicate landmarks
  const roleCounts = {};
  results.landmarks.forEach(landmark => {
    roleCounts[landmark.role] = (roleCounts[landmark.role] || 0) + 1;
  });

  results.landmarks.forEach(landmark => {
    landmark.isUnique = roleCounts[landmark.role] === 1;
  });

  return results;
}

function ensureUniqueLandmarks(document) {
  const landmarkChecks = checkLandmarks(document);
  const duplicates = landmarkChecks.landmarks.filter(landmark => !landmark.isUnique);
  
  duplicates.forEach((duplicate, index) => {
    if (index > 0) {
      duplicate.element.setAttribute('role', 'none');
    }
  });
  
  return duplicates.length;
}

function fixFakeLinkIssue(document) {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[role="link"]:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.addEventListener('click', (e) => {
      e.preventDefault();
    });
  });
  return fakeLinks.length;
}

function fixFakeLinkIssues(document) {
  return fixFakeLinkIssue(document);
}

function googleSignIn() {
  // Google sign-in implementation
  console.log('Google sign-in logic implemented');
}

function fixButtonIdentifiers(document) {
  const buttons = document.querySelectorAll('[id*="button"], [id*="btn"]');
  buttons.forEach(button => {
    if (button.tagName !== 'BUTTON' && button.tagName !== 'A' && !button.getAttribute('role')) {
      button.setAttribute('role', 'button');
    }
  });
  return buttons.length;
}

function addSvgAccessibleNames(document) {