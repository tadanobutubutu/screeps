// This is a simple utility library with added dependency graph rendering and module structure display functionalities

function multiply(a, b) {
  return a * b;
}

function add(a, b) {
  return a + b;
}

// TODO: Implement divide function that handles division with proper error handling
function divide(a, b) {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}

function greet(name) {
  return `Hello, ${name}!`;
}

// Accessibility enhancements

/**
 * REACT_015: Add lang attribute to HTML element
 */
function addLangAttribute() {
  const html = document.documentElement;
  if (html && !html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

/**
 * REACT_027: Fix table structure issues
 */
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with thead and tbody
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          th.setAttribute('scope', 'col');
          headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
        if (firstRow.parentNode) {
          firstRow.parentNode.removeChild(firstRow);
        }
      }
    }
    
    // Ensure tbody exists
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      if (rows.length > 0) {
        const tbody = document.createElement('tbody');
        rows.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
}

/**
 * REACT_017: Add main landmark
 */
function addMainLandmark() {
  // Find existing main element or create one
  let main = document.querySelector('main');
  if (!main) {
    // If there's no main, find the largest content area and mark it
    const contentAreas = document.querySelectorAll('div[role="main"], div#content, div#main');
    if (contentAreas.length > 0) {
      contentAreas[0].setAttribute('role', 'main');
    } else {
      // Create a main element wrapping main content
      main = document.createElement('main');
      const body = document.body;
      if (body.firstChild) {
        main.appendChild(body.firstChild);
        body.insertBefore(main, body.firstChild);
      } else {
        body.appendChild(main);
      }
    }
  }
  return main;
}

/**
 * REACT_041: Add accessible names to SVGs
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      // Check for title element inside SVG
      let title = svg.querySelector('title');
      if (!title) {
        title = document.createElement('title');
        title.textContent = `SVG icon ${index + 1}`;
        svg.insertBefore(title, svg.firstChild);
      }
      
      // Link title to SVG using aria-labelledby
      const titleId = `svg-title-${index}-${Date.now()}`;
      title.setAttribute('id', titleId);
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

/**
 * REACT_025: Ensure unique landmarks - keep single <main>
 */
function ensureUniqueLandmarks() {
  // Count existing main elements
  const mains = document.querySelectorAll('main, [role="main"]');
  
  // Keep only the first main, remove role="main" from others
  mains.forEach((main, index) => {
    if (index > 0) {
      if (main.hasAttribute('role')) {
        main.removeAttribute('role');
      } else if (main.tagName.toLowerCase() === 'main') {
        // Convert extra <main> to <div>
        const div = document.createElement('div');
        div.innerHTML = main.innerHTML;
        Array.from(main.attributes).forEach(attr => {
          div.setAttribute(attr.name, attr.value);
        });
        main.parentNode.replaceChild(div, main);
      }
    }
  });
  
  // Ensure navigation landmarks have unique labels
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      if (navs.length > 1) {
        nav.setAttribute('aria-label', `Navigation ${index + 1}`);
      } else {
        nav.setAttribute('aria-label', 'Main navigation');
      }
    }
  });
}

/**
 * REACT_036: Fix fake link issue - buttons styled as links
 */
function fixFakeLinkIssue() {
  // Find links without href or with href="#" that should be buttons
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '' || href === null) {
      // Check if it behaves like a button (onclick, role="button", or no navigation intent)
      const hasClickHandler = link.hasAttribute('onclick') || 
                              link.getAttribute('role') === 'button' ||
                              !href;
      
      if (hasClickHandler) {
        // Convert to button
        const button = document.createElement('button');
        button.innerHTML = link.innerHTML;
        
        // Copy attributes except href
        Array.from(link.attributes).forEach(attr => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });
        
        button.setAttribute('type', 'button');
        link.parentNode.replaceChild(button, link);
      }
    }
  });
  
  // Also find buttons with invalid href attributes (shouldn't have href at all)
  const buttonLinks = document.querySelectorAll('button[href]');
  buttonLinks.forEach(button => {
    button.removeAttribute('href');
  });
}

/**
 * Add ARIA role to navigation elements
 */
function addAriaRoleToNavigation() {
  const navigation = document.querySelector('nav');
  if (navigation) {
    if (!navigation.hasAttribute('aria-label') && !navigation.id) {
      navigation.setAttribute('aria-label', 'Navigation');
    }
  }
}

/**
 * Ensure proper focus management for accessibility
 */
function manageFocusAccessibility() {
  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  
  // Trap focus in modals/dialogs
  const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
  modals.forEach(modal => {
    const focusableElements = modal.querySelectorAll(focusableSelectors);
    if (focusableElements.length > 0) {
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];
      
      modal.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstFocusable) {
              e.preventDefault();
              lastFocusable.focus();
            }
          } else {
            if (document.activeElement === lastFocusable) {
              e.preventDefault();
              firstFocusable.focus();
            }
          }
        }
      });
    }
  });
}

// Call the accessibility functions on document ready
function initAccessibility() {
  addLangAttribute();
  fixTableStructureIssues();
  addMainLandmark();
  addSvgAccessibleNames();
  ensureUniqueLandmarks();
  fixFakeLinkIssue();
  addAriaRoleToNavigation();
  manageFocusAccessibility();
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export any existing functions
function someExistingFunction() {
  // Existing functionality
}

function anotherFunction() {
  // More existing functionality
}

// TODO: Identify and update specific functions that render dependency graphs or display module structure for debugging purposes.
function renderDependencyGraph(modules) {
  // Future implementation could traverse and log module dependencies
  console.log('Rendering dependency graph for modules:', modules);
  return {};
}

function displayModuleStructure(modules) {
  // Future implementation could format and print module hierarchy
  console.log('Displaying module structure for modules:', modules);
  return {};
}

// Placeholder for bot logic for Screeps
function loop() {
  for (let name in Game.creeps) {
    let creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      if (creep.store.getFreeCapacity() > 0) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
          creep.moveTo(source);
        }
      }
    }
  }
}

module.exports = {
  multiply,
  add,
  divide,
  greet,
  someExistingFunction,
  anotherFunction,
  renderDependencyGraph,
  displayModuleStructure,
  loop,
  // Accessibility functions (exported for testing)
  addLangAttribute,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinkIssue,
  addAriaRoleToNavigation,
  manageFocusAccessibility,
  initAccessibility
};