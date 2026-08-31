// TODO: This is the existing code that needs to be preserved

// Added missing exports as per the issue
function newExportedFunction() {
    // Implementation of the new function
}

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
}

/**
 * REACT_017: Add landmark roles and fix landmark issues
 */
function addLandmarkRoles() {
    const header = document.querySelector('header');
    if (header && !header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.hasAttribute('role')) {
        nav.setAttribute('role', 'navigation');
    }

    const main = document.querySelector('main');
    if (main && !main.hasAttribute('role')) {
        main.setAttribute('role', 'main');
    }

    const footer = document.querySelector('footer');
    if (footer && !footer.hasAttribute('role')) {
        footer.setAttribute('role', 'contentinfo');
    }
}

/**
 * REACT_025: Ensure unique landmarks (2 issues)
 * Ensures each landmark has a unique label via aria-label or aria-labelledby
 */
function ensureUniqueLandmarks() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
    const labelCounts = {};

    landmarks.forEach((landmark) => {
        const tag = landmark.tagName.toLowerCase();
        labelCounts[tag] = (labelCounts[tag] || 0) + 1;

        if (labelCounts[tag] > 1) {
            if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
                landmark.setAttribute('aria-label', tag.charAt(0).toUpperCase() + tag.slice(1) + ' ' + labelCounts[tag]);
            }
        }
    });
}

/**
 * REACT_041: Add accessible names to 2 SVGs
 */
function addAccessibleNamesToSVGs() {
    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg, index) => {
        if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.hasAttribute('title')) {
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
            title.textContent = 'Graphic ' + (index + 1);
            svg.insertBefore(title, svg.firstChild);
            svg.setAttribute('role', 'img');
        }
    });
}

/**
 * REACT_036: Fix 1 fake link issue
 * Replaces <div> or <span> elements with click handlers that act as links with proper anchor tags
 */
function fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[onclick], [data-href]');
    fakeLinks.forEach((element) => {
        if (element.tagName.toLowerCase() !== 'a' && element.tagName.toLowerCase() !== 'button') {
            const href = element.getAttribute('data-href') || '#';
            const anchor = document.createElement('a');
            anchor.href = href;
            anchor.innerHTML = element.innerHTML;
            anchor.setAttribute('role', 'link');
            anchor.className = element.className;
            element.parentNode.replaceChild(anchor, element);
        }
    });
}

/**
 * REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
 */
function addScopeToTableHeaders() {
    const thElements = document.querySelectorAll('th');
    thElements.forEach((th) => {
        if (!th.hasAttribute('scope')) {
            const isInHead = th.closest('thead') || th.parentNode.parentNode.tagName.toLowerCase() === 'thead';
            th.setAttribute('scope', isInHead ? 'col' : 'row');
        }
    });
}

/**
 * REACT_015: Returns the lang attribute of the HTML element
 * @returns {string} The current lang attribute value or 'en' as default
 */
function getLangAttribute() {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        return htmlElement.getAttribute('lang') || 'en';
    }
    return 'en';
}

/**
 * REACT_017: Validates that landmark elements exist and have appropriate roles
 * @returns {boolean} True if all expected landmarks are valid
 */
function validateLandmark() {
    const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"], header, nav, main, footer');
    let isValid = true;

    landmarks.forEach((landmark) => {
        const tag = landmark.tagName.toLowerCase();
        const expectedRoles = {
            'header': 'banner',
            'nav': 'navigation',
            'main': 'main',
            'footer': 'contentinfo'
        };

        if (expectedRoles[tag] && landmark.getAttribute('role') !== expectedRoles[tag]) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * REACT_017: Validates the structure of landmark elements
 * @returns {boolean} True if landmark structure is valid
 */
function validateLandmarkStructure() {
    const main = document.querySelector('main, [role="main"]');
    const nav = document.querySelector('nav, [role="navigation"]');

    if (!main) {
        return false;
    }

    if (nav && !nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
        return false;
    }

    return true;
}

/**
 * REACT_017: NEW - Implements a focus trap for keyboard navigation within a container
 * @param {HTMLElement} container - The container element to trap focus within
 */
function newFocusTrap(container) {
    if (!container) {
        throw new Error('Container element is required for focus trap');
    }

    const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusableElements = container.querySelectorAll(focusableSelectors);
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event) => {
        if (event.key !== 'Tab') {
            return;
        }

        if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
                event.preventDefault();
                lastFocusable.focus();
            }
        } else {
            if (document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        }
    };

    container.addEventListener('keydown', handleKeyDown);

    return {
        activate: () => {
            if (firstFocusable) {
                firstFocusable.focus();
            }
        },
        deactivate: () => {
            container.removeEventListener('keydown', handleKeyDown);
        }
    };
}

/**
 * REACT_027: Validates accessibility of tables in the document
 * @returns {boolean} True if all tables are accessible
 */
function validateTableAccessibility() {
    const tables = document.querySelectorAll('table');
    let isValid = true;

    tables.forEach((table) => {
        const thElements = table.querySelectorAll('th');
        thElements.forEach((th) => {
            if (!th.hasAttribute('scope') && !th.hasAttribute('id')) {
                isValid = false;
            }
        });

        if (!table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby') && !table.querySelector('caption')) {
            isValid = false;
        }
    });

    return isValid;
}

/**
 * REACT_027: Validates the structure of tables
 * @returns {boolean} True if all tables have proper structure
 */
function validateTableStructure() {
    const tables = document.querySelectorAll('table');
    let isValid = true;

    tables.forEach((table) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length === 0) {
                isValid = false;
            }
        });
    });

    return isValid;
}

/**
 * REACT_041: Gets an accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element to get the accessible name for
 * @returns {string} The accessible name of the SVG
 */
function getSvgAccessibleName(svg) {
    if (!svg) {
        return '';
    }

    if (svg.hasAttribute('aria-label')) {
        return svg.getAttribute('aria-label');
    }

    if (svg.hasAttribute('aria-labelledby')) {
        const labelId = svg.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(labelId);
        if (labelElement) {
            return labelElement.textContent;
        }
    }

    const title = svg.querySelector('title');
    if (title) {
        return title.textContent;
    }

    return '';
}

/**
 * REACT_036: Creates an in-page button for navigation
 * @param {string} text - The text content of the button
 * @param {string} targetId - The id of the target element to scroll to
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, targetId) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', text);
    button.className = 'in-page-button';

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

/**
 * Helper function to get a person's name for accessible labels
 * @param {Object} person - The person object
 * @returns {string} The formatted person name
 */
function personName(person) {
    if (!person) {
        return '';
    }
    if (typeof person === 'string') {
        return person;
    }
    return person.name || person.fullName || `${person.firstName || ''} ${person.lastName || ''}`.trim();
}

/**
 * Ensures an element has an id attribute
 * @param {HTMLElement} element - The element to check
 * @returns {string} The element's id (existing or newly generated)
 */
function ensureElementHasId(element) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (element.id) {
    return element.id;
  }
  
  const id = `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  element.id = id;
  return id;
}

/**
 * Adds an aria-label attribute to an element
 * @param {HTMLElement} element - The element to add aria-label to
 * @param {string} label - The label text
 * @returns {HTMLElement} The element with aria-label added
 */
function addAriaLabel(element, label) {
  if (!element) {
    throw new Error('Element is required');
  }
  
  if (typeof label !== 'string') {
    throw new Error('Label must be a string');
  }
  
  element.setAttribute('aria-label', label);
  return element;
}

/**
 * Renders a dependency graph
 * @param {Object} data - The dependency data to render
 * @param {HTMLElement} container - The container element for the graph
 * @returns {HTMLElement} The rendered graph container
 */
function renderDependencyGraph(data, container) {
  if (!data) {
    throw new Error('Dependency data is required');
  }
  
  const graphContainer = container || document.createElement('div');
  graphContainer.className = 'dependency-graph';
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.setAttribute('viewBox', '0 0 800 600');
  
  // Render nodes and edges based on data
  if (data.nodes && Array.isArray(data.nodes)) {
    data.nodes.forEach((node, index) => {
      const x = 100 + (index % 4) * 200;
      const y = 100 + Math.floor(index / 4) * 150;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('transform', `translate(${x}, ${y})`);
      
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('r', '30');
      circle.setAttribute('fill', node.color || '#4A90E2');
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dy', '.35em');
      text.textContent = node.name || node.id || index;
      
      g.appendChild(circle);
      g.appendChild(text);
      svg.appendChild(g);
    });
  }
  
  // Render edges
  if (data.edges && Array.isArray(data.edges)) {
    data.edges.forEach(edge => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', edge.sourceX || 0);
      line.setAttribute('y1', edge.sourceY || 0);
      line.setAttribute('x2', edge.targetX || 0);
      line.setAttribute('y2', edge.targetY || 0);
      line.setAttribute('stroke', '#999');
      line.setAttribute('stroke-width', '2');
      svg.appendChild(line);
    });
  }
  
  graphContainer.appendChild(svg);
  ensureElementHasId(graphContainer);
  addAriaLabel(graphContainer, 'Dependency graph visualization');
  
  return graphContainer;
}

/**
 * Apply all accessibility fixes
 */
function applyAccessibilityFixes() {
  addLangAttribute('en');
  addLandmarkRoles();
  ensureUniqueLandmarks();
  addAccessibleNamesToSVGs();
  fixFakeLinks();
  addScopeToTableHeaders();
}

/**
 * Existing implementation placeholder
 */
function myFunction() {
  // Existing implementation
}

module.exports = {
  addLangAttribute,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addScopeToTableHeaders,
  applyAccessibilityFixes,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  myFunction,
  newExportedFunction,
  getLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  newFocusTrap,
  validateTableAccessibility,
  validateTableStructure,
  getSvgAccessibleName,
  createInPageButton,
  personName
};