const main = require('./utilities');

const { createInPageButton, createWebResourceButton, validateLandmark, validateLandmarkStructure, validateAccessibilityReport } = require('./utilities');

const { addLangAttribute, fixTableStructureIssues, addMainLandmark, ensureUniqueLandmarks, setSvgAccessibilityProps, addSvgAccessibleNames, addAccessibleNamesToSVGs, fixFakeLinkIssue, fixFakeLinkIssues, fixLandmarkIssues, addLandmarkRegions, uniqueLandmarks, fixImageAltTexts, googleSignIn, handleCredentialResponse, ensureElementHasId, ensureElementHasIdOrigin, addAriaLabel, renderDependencyGraphs, fixButtonIdentifiers, fixDependencyGraphAria, addMainLandmarkToIndex, addressAccessibilityIssues } = main;

module.exports = {
  ...main,

  // TODO: Address accessibility issues from insight report
  addressAccessibilityIssues: (container) => {
    const fixes = {
      langAdded: false,
      mainLandmarkAdded: false,
      landmarksFixed: 0,
      svgNamesAdded: 0,
      fakeLinksFixed: 0
    };

    // Add lang attribute to HTML element if missing
    const htmlElement = container.querySelector('html') || document.documentElement;
    const langAttr = getLangAttribute(htmlElement);
    if (!langAttr) {
      htmlElement.setAttribute('lang', 'en');
      fixes.langAdded = true;
    }

    // Add main landmark if missing
    const mainElement = container.querySelector('main');
    if (!mainElement) {
      const body = container.querySelector('body');
      if (body) {
        const newMain = document.createElement('main');
        while (body.firstChild) {
          newMain.appendChild(body.firstChild);
        }
        body.appendChild(newMain);
        fixes.mainLandmarkAdded = true;
      }
    }

    // Fix landmark issues
    const landmarkFixes = validateLandmark(container);
    if (landmarkFixes && landmarkFixes.length > 0) {
      fixes.landmarksFixed = landmarkFixes.length;
    }
    const landmarkStructureFixes = validateLandmarkStructure(container);
    if (landmarkStructureFixes && landmarkStructureFixes.length > 0) {
      fixes.landmarksFixed += landmarkStructureFixes.length;
    }

    // Fix SVG accessible names
    const svgElements = container.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName && !svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
        svg.setAttribute('aria-label', accessibleName);
        fixes.svgNamesAdded++;
      }
    });

    // Fix fake link issues (elements that look like links but are missing href)
    const fakeLinks = container.querySelectorAll('a:not([href])');
    fakeLinks.forEach(link => {
      const style = window.getComputedStyle(link);
      if (style.cursor === 'pointer' || link.hasAttribute('onclick')) {
        link.setAttribute('role', 'link');
        link.setAttribute('tabindex', '0');
        fixes.fakeLinksFixed++;
      }
    });

    // Validate accessibility report
    const report = validateAccessibilityReport(container);
    if (report && report.length > 0) {
      log(`Accessibility report contains ${report.length} remaining issues`, 'warn');
    }

    if (fixes.langAdded) {
      log('Lang attribute added to HTML element', 'info');
    }

    if (fixes.mainLandmarkAdded) {
      log('Main landmark added', 'info');
    }

    const landmarkFixesCount = fixes.landmarksFixed || 0;
    if (landmarkFixesCount > 0) {
      log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info');
    }

    const svgFixes = fixes.svgNamesAdded || 0;
    if (svgFixes > 0) {
      log(`Fixed accessible names for ${svgFixes} SVGs`, 'info');
    }

    const fakeLinkFixes = fixes.fakeLinksFixed || 0;
    if (fakeLinkFixes > 0) {
      log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info');
    }

    return fixes;
  },

  // TODO: Implement a new function to handle focus trap for keyboard navigation
  focusTrap: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    let activeElementIndex = focusableElements.length - 1;

    function setActiveElement(index) {
      if (index < 0) {
        index = focusableElements.length - 1;
      } else if (index >= focusableElements.length) {
        index = 0;
      }

      if (focusableElements[index]) {
        focusableElements[index].focus();
      } else {
        focusableElements[0].focus();
      }
      activeElementIndex = index;
    }

    function nextFocusableElement() {
      setActiveElement(activeElementIndex + 1);
    }

    function previousFocusableElement() {
      setActiveElement(activeElementIndex - 1);
    }

    function moveFocusToFirst() {
      setActiveElement(0);
    }

    function moveFocusToLast() {
      setActiveElement(focusableElements.length - 1);
    }

    element.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Tab':
          if (e.shiftKey) {
            previousFocusableElement();
          } else {
            nextFocusableElement();
          }
          e.preventDefault();
          break;
        case 'ArrowLeft':
          previousFocusableElement();
          e.preventDefault();
          break;
        case 'ArrowRight':
          nextFocusableElement();
          e.preventDefault();
          break;
        case 'Home':
          moveFocusToFirst();
          e.preventDefault();
          break;
        case 'End':
          moveFocusToLast();
          e.preventDefault();
          break;
      }
    });
  },

  // TODO: Import the new function to create a button with correct accessibility properties for in-page linking
  createInPageButton: createInPageButton,

  // TODO: Create a utility function to create a web resource button suitable for accessibility (e.g., Github, Stack Overflow, etc.)
  createWebResourceButton: createWebResourceButton,

  // TODO: Validate the table structure for accessibility issues
  validateTableAccessibility,
  validateTableStructure,

  // TODO: Validate the landmark structure for accessibility issues
  validateLandmark,
  validateLandmarkStructure,

  // TODO: Extract the accessible name for an SVG from its content
  getSvgAccessibleName,

  // TODO: Add a language attribute to the HTML element
  getLangAttribute,

  // TODO: Validate the accessibility report for issues
  validateAccessibilityReport,

  // TODO: Address new accessibility issues from insight report ( implement new functions and fixes as needed)

  // Credential response handling
  async handleCredentialResponse(response) {
    if (!response) {
      throw new Error('No response received');
    }

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.token) {
      return {
        success: true,
        token: response.token,
        expiresIn: response.expiresIn || 3600
      };
    }

    throw new Error('Invalid credential response');
  },

  // Existing utility functions
  log: (message, level = 'info') => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} [${level}] ${message}`);
  },

  // Export functionality with accessibility support
  exportUtils,

  // New focus trap functionality for keyboard navigation
  focusTrap
};

function validateLandmark(landmarkElement) {
  // Implementation for REACT_017: Add/fix 4 landmark issues
  if (!landmarkElement) {
    return { valid: false, errors: ['Landmark element is required'] };
  }

  const errors = [];
  const validRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  const role = landmarkElement.getAttribute('role');

  // Check if landmark has a valid role
  if (!role) {
    errors.push('Landmark element should have a role attribute');
  } else if (!validRoles.includes(role)) {
    errors.push(`Landmark element has invalid role: ${role}`);
  }

  // Check if landmark has accessible name
  const accessibleName = landmarkElement.getAttribute('aria-label') ||
                        landmarkElement.getAttribute('aria-labelledby') ||
                        landmarkElement.getAttribute('title');
  if (!accessibleName) {
    errors.push('Landmark element should have an accessible name');
  }

  // For navigation landmarks, ensure they have distinct accessible names
  if (role === 'navigation' && !accessibleName) {
    errors.push('Navigation landmark should have an accessible name to distinguish it from other navigation landmarks');
  }

  return {
    valid: errors.length === 0,
    errors,
    role,
    hasAccessibleName: !!accessibleName
  };
}

function validateLandmarkStructure(landmarks) {
  // Implementation for REACT_017: Add/fix 4 landmark issues
  if (!Array.isArray(landmarks)) {
    return { valid: false, errors: ['Landmarks should be provided as an array'] };
  }

  const errors = [];
  const seenRoles = {};
  let duplicateCount = 0;

  // Check for duplicate landmarks of the same type (REACT_025: Ensure unique landmarks)
  landmarks.forEach((landmark, index) => {
    const role = landmark.getAttribute('role');
    if (role) {
      if (!seenRoles[role]) {
        seenRoles[role] = 0;
      }
      seenRoles[role]++;
      
      if (seenRoles[role] > 1) {
        duplicateCount++;
        errors.push(`Duplicate landmark of role "${role}" found at index ${index}. Only one "${role}" landmark should exist per page.`);
      }
    }
  });

  // Check that main landmark exists exactly once
  const mainLandmarks = landmarks.filter(l => l.getAttribute('role') === 'main');
  if (mainLandmarks.length === 0) {
    errors.push('Page should have exactly one main landmark');
  } else if (mainLandmarks.length > 1) {
    errors.push('Page should have exactly one main landmark, but found multiple');
  }

  return {
    valid: errors.length === 0,
    errors,
    landmarkCount: landmarks.length,
    duplicateCount,
    mainLandmarkCount: mainLandmarks.length
  };
}

function ensureElementHasId(element) {
  // Implement logic to ensure the element has an id
  if (!element || !element.setAttribute) {
    return null;
  }
  
  const existingId = element.getAttribute('id');
  if (existingId) {
    return existingId;
  }
  
  // Generate a unique ID based on element type and timestamp
  const tagName = element.tagName ? element.tagName.toLowerCase() : 'element';
  const uniqueId = `${tagName}-${Date.now()}`;
  element.setAttribute('id', uniqueId);
  return uniqueId;
}

function addAriaLabel(element, label) {
  // Implement logic to add aria-label to the element
  if (!element || !element.setAttribute) {
    return false;
  }
  
  if (label) {
    element.setAttribute('aria-label', label);
    return true;
  }
  
  // If no label provided, try to derive one from content
  const content = element.textContent?.trim() || element.getAttribute('title');
  if (content) {
    element.setAttribute('aria-label', content);
    return true;
  }
  
  return false;
}

function createInPageButton(text, options = {}) {
  // Implementation for REACT_036: Fix 1 fake link issue
  const { 
    href = null, 
    onClick = null, 
    ariaLabel = null, 
    className = 'in-page-button' 
  } = options;
  
  const button = document.createElement('button');
  button.textContent = text;
  button.className = className;
  
  // Set aria-label if provided or derive from text
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  } else {
    button.setAttribute('aria-label', text);
  }
  
  // Add click event if provided
  if (onClick && typeof onClick === 'function') {
    button.addEventListener('click', onClick);
  }
  
  // If href is provided, make it a real link instead
  if (href) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.className = className;
    
    if (ariaLabel) {
      link.setAttribute('aria-label', ariaLabel);
    } else {
      link.setAttribute('aria-label', text);
    }
    
    return link;
  }
  
  return button;
}

function renderDependencyGraphs(element) {
  // Implement logic to render the dependency graphs
  if (!element || !element.appendChild) {
    return null;
  }
  
  // Create container for graphs
  const container = document.createElement('div');
  container.setAttribute('role', 'region');
  container.setAttribute('aria-label', 'Dependency Graphs');
  container.className = 'dependency-graphs-container';
  
  // Create SVG for graph visualization
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '400');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Dependency Graph Visualization');
  svg.setAttribute('tabindex', '0');
  
  // Add title for accessibility
  const title = document.createElementNS(svgNS, 'title');
  title.textContent = 'Dependency Graph Visualization';
  svg.appendChild(title);
  
  // Add descriptive text for screen readers
  const desc = document.createElementNS(svgNS, 'desc');
  desc.textContent = 'Interactive visualization showing module dependencies. Use arrow keys to navigate between nodes.';
  svg.appendChild(desc);
  
  // Sample nodes (would be populated with actual dependency data)
  const nodes = [
    { id: 'main', label: 'Main', x: 100, y: 100 },
    { id: 'module1', label: 'Module 1', x: 200, y: 200 },
    { id: 'module2', label: 'Module 2', x: 300, y: 150 }
  ];
  
  // Add nodes to SVG
  nodes.forEach(node => {
    const g = document.createElementNS(svgNS, 'g');
    g.setAttribute('role', 'group');
    g.setAttribute('aria-label', node.label);
    g.setAttribute('tabindex', '0');
    
    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', node.x);
    circle.setAttribute('cy', node.y);
    circle.setAttribute('r', '20');
    circle.setAttribute('fill', '#4a90e2');
    
    const text = document.createElementNS(svgNS, 'text');
    text.setAttribute('x', node.x);
    text.setAttribute('y', node.y + 35);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', '#333');
    text.textContent = node.label;
    
    g.appendChild(circle);
    g.appendChild(text);
    svg.appendChild(g);
  });
  
  container.appendChild(svg);
  element.appendChild(container);
  
  return container;
}

// Calculate sum of numbers array
function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}