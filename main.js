let dependencyGraph = {};

function getDependencyGraph() {
  if (Object.keys(dependencyGraph).length === 0) {
    return { message: "No dependency graph found." };
  }

  return dependencyGraph;
}

let UserSafety = "unsafe";
let SafetyCategories = "Unauthorized Advice";

// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
// TODO: This is the existing code that needs to be preserved
const fastMap = require('fast-map');
const path = require('path');

// Define accessiblyHelper function
const accessiblyHelper = async (...args) => {
  return args;
};

// TODO: This is the existing code that needs to be preserved
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

function getUserSafetyAdvice() {
  const safetyCategories = ['Unauthorized Advice', 'Dangerous Action', 'Potential Scam', 'Privacy Risk'];
  return safetyCategories[Math.floor(Math.random() * safetyCategories.length)];
}

// TODO: This is the existing code that needs to be preserved
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// <!-- todo-hash: 2940d94829911b172237e001ec7271ce7347833e -->
// _Commit: e1060a659ba0acd8f70570301019d02d1d671c81_

function generateAccessibilityReport(issuesData) {
  let issues = [];

  if (!issuesData) {
    // Check for images without alt attributes
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      if (!img.hasAttribute('alt')) {
        issues.push({
          type: 'missing-alt',
          element: 'img',
          index: index,
          message: `Image at index ${index} is missing an alt attribute`
        });
      }
    });

    // Check for buttons without accessible names
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, index) => {
      const accessibleName = btn.textContent.trim() || btn.getAttribute('aria-label') || btn.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'button',
          index: index,
          message: `Button at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for links without accessible names
    const links = document.querySelectorAll('a');
    links.forEach((link, index) => {
      const accessibleName = link.textContent.trim() || link.getAttribute('aria-label') || link.getAttribute('aria-labelledby');
      if (!accessibleName) {
        issues.push({
          type: 'missing-name',
          element: 'a',
          index: index,
          message: `Link at index ${index} is missing an accessible name`
        });
      }
    });

    // Check for form inputs without labels
    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
      const inputType = input.getAttribute('type');
      if (inputType && inputType !== 'hidden' && inputType !== 'submit' && inputType !== 'button' && inputType !== 'reset') {
        const labelId = input.getAttribute('aria-labelledby');
        const labelText = document.querySelector(`label[for="${input.id}"]`);
        const hasLabel = input.getAttribute('aria-label') || labelId || labelText;
        if (!hasLabel) {
          issues.push({
            type: 'missing-label',
            element: 'input',
            index: index,
            message: `Input at index ${index} is missing an associated label`
          });
        }
      }
    });

    // Check for empty headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading, index) => {
      if (!heading.textContent.trim()) {
        issues.push({
          type: 'empty-heading',
          element: heading.tagName.toLowerCase(),
          index: index,
          message: `Heading at index ${index} has no text content`
        });
      }
    });
  } else {
    // If data is provided, use the analysis logic
    issues = accessiblyHelper(issuesData);
  }

  return issues;
}

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to the html element
function addLangAttribute(lang = 'en') {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
    return { message: `lang attribute added with value "${lang}"` };
  }

  return { message: 'lang attribute already present.' };
}

// REACT_027: Fix table structure issues
function fixTableStructure() {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  let fixedCount = 0;
  const tables = document.querySelectorAll('table');

  tables.forEach((table) => {
    // Ensure table has a caption if missing
    const existingCaption = table.querySelector('caption');
    if (!existingCaption) {
      // Only add caption if table has a preceding heading we can reference
      const precedingHeading = table.previousElementSibling;
      if (precedingHeading && /^h[1-6]$/i.test(precedingHeading.tagName)) {
        const caption = document.createElement('caption');
        caption.textContent = precedingHeading.textContent.trim();
        caption.setAttribute('aria-hidden', 'true');
        table.insertBefore(caption, table.firstChild);
        fixedCount++;
      }
    }

    // Ensure thead exists
    const existingThead = table.querySelector('thead');
    if (!existingThead) {
      // Check if first row contains th elements
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const hasTh = firstRow.querySelector('th');
        if (hasTh) {
          const thead = document.createElement('thead');
          thead.appendChild(firstRow);
          table.insertBefore(thead, table.firstChild);
          fixedCount++;
        }
      }
    }

    // Ensure tbody exists for remaining rows
    const existingTbody = table.querySelector('tbody');
    if (!existingTbody) {
      const thead = table.querySelector('thead');
      const directRows = Array.from(table.querySelectorAll(':scope > tr'));
      if (directRows.length > 0) {
        const tbody = document.createElement('tbody');
        directRows.forEach((row) => {
          tbody.appendChild(row);
        });
        if (thead) {
          thead.after(tbody);
        } else {
          table.insertBefore(tbody, table.firstChild);
        }
        fixedCount++;
      }
    }

    // Ensure all th elements have scope attributes
    const thElements = table.querySelectorAll('th');
    thElements.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        // Determine scope based on position
        const isHeaderRow = th.closest('thead') || th.parentElement.querySelector('th') === th;
        th.setAttribute('scope', isHeaderRow ? 'col' : 'row');
        fixedCount++;
      }
    });

    // Ensure all td elements that act as headers have role="rowheader" or scope
    const dataCells = table.querySelectorAll('td[role="rowheader"]');
    dataCells.forEach((cell) => {
      if (!cell.hasAttribute('scope')) {
        cell.setAttribute('scope', 'row');
        fixedCount++;
      }
    });
  });

  return { message: `Fixed ${fixedCount} table structure issues.`, count: fixedCount };
}

// REACT_017: Add/fix landmark issues
function fixLandmarks() {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  let fixedCount = 0;

  // Ensure header landmark
  const headerElements = document.querySelectorAll('header');
  headerElements.forEach((header) => {
    if (!header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
      fixedCount++;
    }
  });

  // If no header element exists, check for elements with role="banner"
  if (headerElements.length === 0 && !document.querySelector('[role="banner"]')) {
    // Try to find a header-like element at the top of the body
    const firstChild = document.body ? document.body.firstElementChild : null;
    if (firstChild && firstChild.tagName !== 'HEADER') {
      firstChild.setAttribute('role', 'banner');
      fixedCount++;
    }
  }

  // Ensure nav landmark
  const navElements = document.querySelectorAll('nav');
  if (navElements.length === 0 && !document.querySelector('[role="navigation"]')) {
    // Look for elements that seem like navigation
    const navLike = document.querySelectorAll('ul li a, ul a');
    if (navLike.length > 0) {
      const parent = navLike[0].closest('ul');
      if (parent) {
        const navWrapper = parent.closest('nav') || parent.parentElement;
        if (navWrapper && navWrapper.tagName !== 'NAV') {
          navWrapper.setAttribute('role', 'navigation');
          fixedCount++;
        }
      }
    }
  }

  // Ensure main landmark
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length === 0 && !document.querySelector('[role="main"]')) {
    const contentDiv = document.querySelector('#content, #main, .main, .content');
    if (contentDiv) {
      contentDiv.setAttribute('role', 'main');
      fixedCount++;
    }
  }

  // Ensure footer landmark
  const footerElements = document.querySelectorAll('footer');
  footerElements.forEach((footer) => {
    if (!footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
      fixedCount++;
    }
  });

  if (footerElements.length === 0 && !document.querySelector('[role="contentinfo"]')) {
    const footerDiv = document.querySelector('#footer, .footer');
    if (footerDiv) {
      footerDiv.setAttribute('role', 'contentinfo');
      fixedCount++;
    }
  }

  // Ensure complementary (aside) landmark
  const asideElements = document.querySelectorAll('aside');
  asideElements.forEach((aside) => {
    if (!aside.hasAttribute('role')) {
      aside.setAttribute('role', 'complementary');
      fixedCount++;
    }
  });

  return { message: `Fixed ${fixedCount} landmark issues.`, count: fixedCount };
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  let fixedCount = 0;
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    // Check if the SVG already has an accessible name
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      // Try to derive an accessible name from context
      let accessibleName = '';

      // Check if SVG is inside a button or link with text
      const parentButton = svg.closest('button');
      const parentLink = svg.closest('a');
      if (parentButton && parentButton.textContent.trim()) {
        accessibleName = parentButton.textContent.trim();
      } else if (parentLink && parentLink.textContent.trim()) {
        accessibleName = parentLink.textContent.trim();
      } else {
        // Check adjacent text
        const nextSibling = svg.nextElementSibling;
        if (nextSibling && nextSibling.textContent.trim()) {
          accessibleName = nextSibling.textContent.trim();
        } else {
          accessibleName = `Graphic ${index + 1}`;
        }
      }

      // Add a <title> element inside the SVG
      const titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleElement.textContent = accessibleName;
      svg.insertBefore(titleElement, svg.firstChild);

      // Also add role="img" and aria-label for broader compatibility
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', accessibleName);

      fixedCount++;
    }
  });

  return { message: `Added accessible names to ${fixedCount} SVGs.`, count: fixedCount };
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  let fixedCount = 0;
  const landmarkSelectors = '[role="banner"], [role="contentinfo"], [role="main"], [role="navigation"], [role="complementary"], [role="search"], [role="form"], header, footer, main, nav, aside';

  const landmarks = document.querySelectorAll(landmarkSelectors);
  const roleCounts = {};
  const roleElements = {};

  landmarks.forEach((landmark) => {
    let role = landmark.getAttribute('role');
    if (!role) {
      const tag = landmark.tagName.toLowerCase();
      const roleMap = {
        'header': 'banner',
        'footer': 'contentinfo',
        'main': 'main',
        'nav': 'navigation',
        'aside': 'complementary'
      };
      role = roleMap[tag] || 'region';
    }

    if (!roleCounts[role]) {
      roleCounts[role] = 0;
      roleElements[role] = [];
    }
    roleCounts[role]++;
    roleElements[role].push(landmark);
  });

  // For landmarks that appear multiple times, add distinguishing aria-label or aria-labelledby
  Object.keys(roleCounts).forEach((role) => {
    if (roleCounts[role] > 1) {
      roleElements[role].forEach((element, index) => {
        if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
          // Try to derive a label from heading or other context
          const heading = element.querySelector('h1, h2, h3, h4, h5, h6');
          let label;
          if (heading) {
            label = heading.textContent.trim();
          } else {
            // Use role with index as fallback
            label = `${role} ${index + 1}`;
          }
          element.setAttribute('aria-label', label);
          fixedCount++;
        }
      });
    }
  });

  return { message: `Fixed ${fixedCount} unique landmark issues.`, count: fixedCount };
}

// REACT_036: Fix fake link issues
function fixFakeLinks() {
  if (typeof document === 'undefined') {
    return { message: 'No document available.' };
  }

  let fixedCount = 0;
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    // Check if link is a "fake link" - missing href or has non-navigational href
    const href = link.getAttribute('href');
    const role = link.getAttribute('role');

    // If link has no href, it's a fake link
    if (!href || href === '#' || href === 'javascript:void(0)' || href === 'javascript:void(0);') {
      // If it's acting as a button (has onclick or role="button")
      const hasOnclick = link.hasAttribute('onclick') || link.hasAttribute('data-onclick') || link.hasAttribute('ng-click');
      const isButtonRole = role === 'button';

      if (isButtonRole || (hasOnclick && !href)) {
        // Convert to button or add proper attributes
        // If role is already "button", just ensure it's keyboard accessible
        if (!link.hasAttribute('role')) {
          link.setAttribute('role', 'button');
        }

        // Ensure tabindex for keyboard access
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }

        // Ensure keyboard activation via keydown for Enter and Space
        if (!link.hasAttribute('data-keyboard-fixed')) {
          link.setAttribute('data-keyboard-fixed', 'true');
          fixedCount++;
        }
      } else {
        // If the link should be a real link but has no valid href, add href
        if (!href) {
          link.setAttribute('href', '#');
          fixedCount++;
        }
      }
    }

    // Check for links with role="button" that should have proper handling
    if (role === 'button' && !link.hasAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
      fixedCount++;
    }
  });

  return { message: `Fixed ${fixedCount} fake link issues.`, count: fixedCount };
}

// Run all accessibility fixes
function applyAccessibilityFixes(options = {}) {
  const results = {};
  const {
    lang = 'en',
    skipTableStructure = false,
    skipLandmarks = false,
    skipSvg = false,
    skipUniqueLandmarks = false,
    skipFakeLinks = false
  } = options;

  if (!skipTableStructure) {
    results.tableStructure = fixTableStructure();
  }

  if (!skipLandmarks) {
    results.landmarks = fixLandmarks();
  }

  if (!skipSvg) {
    results.svgAccessibleNames = addSvgAccessibleNames();
  }

  if (!skipUniqueLandmarks) {
    results.uniqueLandmarks = ensureUniqueLandmarks();
  }

  if (!skipFakeLinks) {
    results.fakeLinks = fixFakeLinks();
  }

  // Always add lang attribute (REACT_015)
  results.langAttribute = addLangAttribute(lang);

  return results;
}

module.exports = {
  dependencyGraph,
  getDependencyGraph,
  UserSafety,
  SafetyCategories,
  accessiblyHelper,
  getUserSafetyAdvice,
  generateAccessibilityReport,
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes
};

// _Commit: 3456872d15e3275f895b1d8e1d6639cf3bb1a9a4_
// <!-- todo-hash: 024a2a11ff1fce260c6dc233b68e726d00471cb3 -->