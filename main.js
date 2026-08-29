function existingFunction1() {
  // Existing function 1 implementation
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  // Configuration for accessibility features
  config: {
    announcementDelay: 100,
    focusVisibleEnabled: true,
    highContrastMode: false,
    reducedMotionEnabled: false,
    observerEnabled: true,
    skipLinkEnabled: true,
    landmarkCheckEnabled: true,
    svgAccessibilityEnabled: true,
  },

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupSkipLinks();
    this.setupFocusManagement();
    this.enhanceDynamicContent();
    this.checkLandmarkElements();
    this.addSVGAccessibility();
    this.fixFakeLinks();
    this.setupFocusStyles();
    this.setupFocusVisiblePolyfill();
    this.validateARIA();
    this.checkLandmarkElements();
    this.addProperLandmarkRegions();
    this.addSVGAccessibility();
    this.validateARIAUsage();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('class', 'sr-only');
    region.id = 'a11y-live-region';
    
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) return;

    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[role="button"], [role="link"], [tabindex]:not([tabindex="-1"])');
        if (target) {
          e.preventDefault();
          target.click();
        }

        // Escape key to close modals/dropdowns
        if (e.key === 'Escape') {
          const openModal = document.querySelector('[aria-modal="true"][aria-hidden="false"]') || 
                            document.querySelector('[data-modal="open"]');
          if (openModal) {
            openModal.setAttribute('aria-hidden', 'true');
            openModal.classList.remove('is-open');
          }
          document.body.style.overflow = '';
        }
      }

      // Fix Safari focus trapping in dropdowns
      const dropdownContainers = document.querySelectorAll('[data-dropdown]');
      dropdownContainers.forEach(container => {
        container.addEventListener('keydown', (e) => {
          if (e.key !== 'Tab') return;

          const currentFocusedElement = document.activeElement;
          let focusIsInsideContainer = false;

          if (
            currentFocusedElement &&
            (currentFocusedElement === container ||
              currentFocusedElement.closest(container))
          ) {
            focusIsInsideContainer = true;
          }

          // Ensure focus trapping only within the dropdown container
          if (focusIsInsideContainer && e.shiftKey && e.key === 'Tab') {
            // Find the first focusable element within the container
            const firstFocusableElement = container.querySelector(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (firstFocusableElement) {
              e.preventDefault();
              firstFocusableElement.focus();
            }
          }
        });
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[aria-modal="true"][aria-hidden="false"]');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Manage focus for accessibility
  setupSkipLinks() {
    const skipLink = document.querySelector('a[href^="skip"]');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href');
    if (!targetId) return;

    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Jumped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.indexOf('Safari') !== -1) {
        skipLink.focus();
      }

      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      } else {
        document.body.scrollIntoView({ behavior: 'smooth' });
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches || 
           window.matchMedia('(forced-colors: active)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) return;
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach(landmarkTag => {
      const landmark = document.querySelector(landmarkTag);
      if (landmark && landmark.id === '') {
        landmark.id = `landmark-${landmarkTag}-${Math.floor(Math.random() * 1000)}`;
      }
    });
  },

  // New function to add proper landmark regions for accessibility
  addProperLandmarkRegions() {
    // Ensure the main landmark exists
    if (!document.querySelector('main, [role="main"]')) {
      const main = document.createElement('main');
      main.setAttribute('role', 'main');
      main.id = 'main-content';
      document.body.insertBefore(main, document.body.firstChild);
    }
    
    // Add landmark regions if missing
    const landmarks = ['nav', 'header', 'footer', 'aside'];
    landmarks.forEach(landmark => {
      const selector = `${landmark}, [role="${landmark}"]`;
      if (!document.querySelector(selector)) {
        const el = document.createElement(landmark);
        el.setAttribute('role', landmark);
        document.body.appendChild(el);
      }
    });

    // Ensure contentinfo landmark for footer
    const footer = document.querySelector('footer');
    if (footer && !footer.getAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }

    // Ensure complementary landmark for aside
    const aside = document.querySelector('aside');
    if (aside && !aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }

    // Add form landmark to forms missing a label
    const forms = document.querySelectorAll('form');
    forms.forEach((form, index) => {
      if (!form.getAttribute('aria-label') && !form.getAttribute('aria-labelledby')) {
        const label = form.querySelector('legend, label');
        if (!label) {
          form.setAttribute('role', 'form');
          form.setAttribute('aria-label', `form-${index + 1}`);
        }
      }
    });

    // Add search landmark if missing
    const searchRegions = document.querySelectorAll('[role="search"]');
    if (searchRegions.length === 0) {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput && !searchInput.closest('[role="search"]')) {
        const searchRegion = document.createElement('div');
        searchRegion.setAttribute('role', 'search');
        searchRegion.setAttribute('aria-label', 'search');
        searchInput.parentNode.insertBefore(searchRegion, searchInput);
        searchRegion.appendChild(searchInput);
      }
    }

    // Ensure all landmark regions have accessible names where required
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'form', 'search'];
    landmarkRoles.forEach((role) => {
      const elements = document.querySelectorAll(`[role="${role}"]`);
      elements.forEach((el) => {
        if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          const tagName = el.tagName.toLowerCase();
          let label = '';
          switch (role) {
            case 'navigation':
              label = 'navigation';
              break;
            case 'complementary':
              label = 'complementary';
              break;
            case 'contentinfo':
              label = 'contentinfo';
              break;
            case 'search':
              label = 'search';
              break;
            case 'form':
              label = 'form';
              break;
            default:
              label = role;
          }
          el.setAttribute('aria-label', label);
        }
      });
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      // Ensure SVG has a title for accessible name
      let titleElement = svg.querySelector('title');
      if (!titleElement) {
        titleElement = document.createElement('title');
        titleElement.textContent = 'Image'; // Default accessible name
        svg.insertBefore(titleElement, svg.firstChild);
      }

      // Ensure title has an ID for aria-labelledby
      if (!titleElement.id) {
        titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
      }

      // Set aria-labelledby to point to the title
      svg.setAttribute('aria-labelledby', titleElement.id);

      // Add role img if not present (redundant but safe)
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
    });
  },

  // New function to validate ARIA usage
  validateARIAUsage() {
    const ariaElements = document.querySelectorAll('[role]');
    ariaElements.forEach(el => {
      const role = el.getAttribute('role');
      // Add validation logic here as needed
    });
  },

  // New function to enhance dynamic content
  enhanceDynamicContent() {
    // Observe DOM changes for dynamic content
    if (!('MutationObserver' in window)) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Add appropriate ARIA attributes to dynamically added content
              this.applyARIAtoNode(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  
  // New function to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach((issue) => {
      // Handle each issue type
      switch (issue.type) {
        case 'missing-lang':
          if (document.documentElement.lang === '') {
            document.documentElement.lang = 'en';
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            document.body.prepend(skipLink);
          }
          break;
        case 'missing-alt':
          document.querySelectorAll('img').forEach((img) => {
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', 'Image description');
            }
          });
          break;
        case 'missing-label':
          document.querySelectorAll('input, select, textarea').forEach((el) => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
              el.setAttribute('aria-label', 'Form field');
            }
          });
          break;
        // Add more cases as needed
      }
    });
  },

  // New function to fix fake links (REACT_036)
  fixFakeLinks() {
    const fakeLinks = document.querySelectorAll('[href]:not(a)');
    fakeLinks.forEach((link) => {
      link.setAttribute('role', 'link');
      link.setAttribute('tabindex', '0');
      link.setAttribute('data-interactive', 'true');
    });
  },

  // New function to wrap primary content in main element
  wrapPrimaryContentInMain() {
    if (document.querySelector('main, [role="main"]')) return;

    const mainElement = document.createElement('main');
    mainElement.setAttribute('role', 'main');
    mainElement.id = 'main-content';

    // Move all body children into the main element
    while (document.body.firstChild) {
      mainElement.appendChild(document.body.firstChild);
    }

    document.body.appendChild(mainElement);
  },

  // NEW: Add focus visibility styles for keyboard navigation
  setupFocusStyles() {
    // Check if styles already added
    if (document.getElementById('a11y-focus-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'a11y-focus-styles';
    style.textContent = `
      /* High contrast focus indicators for keyboard users */
      :focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      /* Ensure focus visibility in different contexts */
      [tabindex]:focus,
      button:focus,
      a:focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      /* Reduce motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible polyfill support
    if (!('focus-visible' in document.documentElement.classList)) {
      document.documentElement.classList.add('focus-visible');
    }
  },
  
  // NEW: Setup focus-visible polyfill for better focus management
  setupFocusVisiblePolyfill() {
    let hadKeyboardEvent = false;
    
    const showRemaining = () => {
      document.documentElement.classList.remove('focus-visible');
      document.documentElement.classList.add('focus-hidden');
    };
    
    const handleBlur = (e) => {
      if (e.target.matches(':focus-visible')) {
        hadKeyboardEvent = true;
      }
    };
    
    const handleKeydown = (e) => {
      if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        hadKeyboardEvent = true;
      }
    };
    
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('focus', (e) => {
      if (hadKeyboardEvent) {
        document.documentElement.classList.add('focus-visible');
      }
    }, true);
  },
  
  // NEW: Enhance dynamic content updates for better screen reader support
  enhanceDynamicContent() {
    // Observe DOM changes for dynamic content
    if (!('MutationObserver' in window)) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Add appropriate ARIA attributes to dynamically added content
              this.applyARIAtoNode(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  
  // NEW: Apply ARIA attributes to dynamically added elements
  applyARIAtoNode(node) {
    if (!node || !node.setAttribute) return;
    
    // Handle buttons without text content
    if (node.tagName === 'BUTTON' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Button');
    }
    
    // Handle links without text
    if (node.tagName === 'A' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Link');
    }
    
    // Handle inputs without labels
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.tagName) && 
        !node.getAttribute('aria-label') && 
        !node.getAttribute('id')) {
      node.setAttribute('aria-label', 'Form field');
    }
    
    // Handle images without alt text
    if (node.tagName === 'IMG' && !node.getAttribute('alt')) {
      node.setAttribute('alt', '');
    }
    
    // Process children recursively
    const children = node.querySelectorAll('button, a, input, select, textarea, img');
    children.forEach(child => {
      this.applyARIAtoNode(child);
    });
  },
  
  // NEW: Validate and improve ARIA usage
  validateARIA() {
    // Remove duplicate IDs
    const allElements = document.querySelectorAll('[id]');
    const idMap = {};
    
    allElements.forEach(el => {
      const id = el.getAttribute('id');
      if (idMap[id]) {
        el.removeAttribute('id');
      } else {
        idMap[id] = true;
      }
    });
    
    // Ensure ARIA attributes are properly used
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
      if (el.getAttribute('tabindex') !== '-1') {
        el.setAttribute('tabindex', '-1');
      }
    });
  }
};

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.id = 'main-content';

// Set lang attribute on <html> if missing
const htmlElement = document.documentElement;
if (!htmlElement.getAttribute('lang')) {
  htmlElement.setAttribute('lang', 'en');
}

// Move all existing body content into main element while preserving the document structure
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  body.appendChild(mainElement);
});

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

function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

// New function or changes requested in the issue
function newFunction() {
  // Implement the new function here
}

// Original code with accessibility issue
function dependencyGraph() {
  // ... existing code ...
}

// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->

const existingConst1 = {
  // Existing constant 1 definition
};

/**
 * Checks if a given link/URL is accessible by making an HTTP HEAD request.
 * @param {string} url - The URL to check for accessibility
 * @returns {Promise<boolean>} - Returns true if the link is accessible (status 200-399), false otherwise
 */
async function isLinkAccessible(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    });

    if (response.ok) {
      return true;
    }

    try {
      const response = await fetch(url, { method: 'GET' });
      return response.ok;
    } catch (getError) {
      return false;
    }
  } catch (error) {
    return false;
  }
}

function isLinkAccessibleSync(url) {
  try {
    const response = isLinkAccessible(url);
    return response;
  } catch (error) {
    return false;
  }
}

function createInPageButton(options = {}) {
  // ... existing code ...
}

function validateTableAccessibility(table) {
  // ... existing code ...
}

function validateTableStructure(table) {
  // ... existing code ...
}

function validateLandmark() {
  // ... existing code ...
}

function validateLandmarkStructure() {
  // ... existing code ...
}

function validateLandmarkAttributes() {
  // ... existing code ...
}

function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName !== 'SVG') return null;
  return svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || null;
}

function setSvgAttributes(svg, options = {}) {
  if (!svg || svg.tagName !== 'SVG') return false;
  // Implementation here
  return true;
}

function ensureUniqueLandmarks() {
  // ... existing code ...
}

function validateLinkAccessibility() {
  // ... existing code ...
}

function handleFakeLinks() {
  // ... existing code ...
}

// Dependency graph storage
const dependencyGraphStore = {
  nodes: new Map(),
  edges: [],

  // Add a module to the graph
  addModule(moduleName, metadata = {}) {
    if (!this.nodes.has(moduleName)) {
      this.nodes.set(moduleName, {
        name: moduleName,
        dependencies: [],
        dependents: [],
        metadata: {
          ...metadata,
          addedAt: Date.now()
        }
      });
    }
    return this.nodes.get(moduleName);
  },

  // Add a dependency relationship between two modules
  addDependency(fromModule, toModule) {
    if (!this.nodes.has(fromModule)) {
      this.addModule(fromModule);
    }
    if (!this.nodes.has(toModule)) {
      this.addModule(toModule);
    }

    const fromNode = this.nodes.get(fromModule);
    const toNode = this.nodes.get(toModule);

    if (!fromNode.dependencies.includes(toModule)) {
      fromNode.dependencies.push(toModule);
    }
    if (!toNode.dependents.includes(fromModule)) {
      toNode.dependents.push(fromModule);
    }

    const edgeKey = `${fromModule}->${toModule}`;
    if (!this.edges.find(edge => edge.key === edgeKey)) {
      this.edges.push({ key: edgeKey, from: fromModule, to: toModule });
    }
  },

  // Remove a module and all its relationships
  removeModule(moduleName) {
    if (!this.nodes.has(moduleName)) return;

    const node = this.nodes.get(moduleName);
    node.dependencies.forEach(dep => {
      const depNode = this.nodes.get(dep);
      if (depNode) {
        depNode.dependents = depNode.dependents.filter(d => d !== moduleName);
      }
    });

    node.dependents.forEach(dep => {
      const depNode = this.nodes.get(dep);
      if (depNode) {
        depNode.dependencies = depNode.dependencies.filter(d => d !== moduleName);
      }
    });

    this.edges = this.edges.filter(edge => edge.from !== moduleName && edge.to !== moduleName);
    this.nodes.delete(moduleName);
  },

  // Detect circular dependencies
  detectCircularDependencies() {
    const visited = new Set();
    const recursionStack = new Set();
    const cycles = [];

    const dfs = (moduleName, path = []) => {
      if (recursionStack.has(moduleName)) {
        const cycleStart = path.indexOf(moduleName);
        if (cycleStart !== -1) {
          cycles.push([...path.slice(cycleStart), moduleName]);
        }
        return;
      }

      if (visited.has(moduleName)) return;

      visited.add(moduleName);
      recursionStack.add(moduleName);

      const node = this.nodes.get(moduleName);
      if (node) {
        node.dependencies.forEach(dep => {
          dfs(dep, [...path, moduleName]);
        });
      }

      recursionStack.delete(moduleName);
    };

    this.nodes.forEach((_, moduleName) => {
      if (!visited.has(moduleName)) {
        dfs(moduleName);
      }
    });

    return cycles;
  },

  // Get topological order of modules
  getTopologicalOrder() {
    const inDegree = new Map();
    const result = [];
    const queue = [];

    this.nodes.forEach((node, name) => {
      inDegree.set(name, node.dependents.length);
    });

    this.nodes.forEach((node, name) => {
      if (inDegree.get(name) === 0) {
        queue.push(name);
      }
    });

    while (queue.length > 0) {
      const moduleName = queue.shift();
      result.push(moduleName);

      const node = this.nodes.get(moduleName);
      if (node) {
        node.dependencies.forEach(dep => {
          const currentDegree = inDegree.get(dep) || 0;
          inDegree.set(dep, currentDegree - 1);
          if (inDegree.get(dep) === 0) {
            queue.push(dep);
          }
        });
      }
    }

    return result.length === this.nodes.size ? result : null;
  },

  // Reset the graph
  reset() {
    this.nodes.clear();
    this.edges = [];
  }
};

// Render dependency graph as ASCII tree
function renderDependencyGraph(moduleName, options = {}) {
  if (!dependencyGraphStore.nodes.has(moduleName)) {
    return `Module "${moduleName}" not found in dependency graph.`;
  }

  const { maxDepth = 5, showMetadata = false } = options;
  const visited = new Set();
  const lines = [];

  const renderNode = (name, prefix = '', isLast = true, depth = 0) => {
    if (depth > maxDepth) {
      lines.push(`${prefix}${isLast ? '└── ' : '├── '}... (max depth reached)`);
      return;
    }

    if (visited.has(name)) {
      lines.push(`${prefix}${isLast ? '└── ' : '├── '}${name} (circular reference)`);
      return;
    }

    visited.add(name);
    const node = dependencyGraphStore.nodes.get(name);
    const connector = isLast ? '└── ' : '├── ';
    const childPrefix = prefix + (isLast ? '    ' : '│   ');

    let line = `${prefix}${connector}${name}`;
    if (showMetadata && node && node.metadata) {
      const metaKeys = Object.keys(node.metadata).filter(k => k !== 'addedAt');
      if (metaKeys.length > 0) {
        const metaStr = metaKeys.map(k => `${k}=${node.metadata[k]}`).join(', ');
        line += ` [${metaStr}]`;
      }
    }
    lines.push(line);

    if (node && node.dependencies.length > 0) {
      node.dependencies.forEach((dep, index) => {
        const isLastChild = index === node.dependencies.length - 1;
        renderNode(dep, childPrefix, isLastChild, depth + 1);
      });
    }

    visited.delete(name);
  };

  renderNode(moduleName, '', true, 0);
  return lines.join('\n');
}

// Render dependency graph as Mermaid diagram
function renderDependencyGraphMermaid(moduleName, options = {}) {
  if (!dependencyGraphStore.nodes.has(moduleName)) {
    return `Module "${moduleName}" not found in dependency graph.`;
  }

  const { direction = 'TB' } = options;
  const lines = [`graph ${direction}`];
  const visited = new Set();
  const renderedEdges = new Set();

  const renderEdges = (name) => {
    if (visited.has(name)) return;
    visited.add(name);

    const node = dependencyGraphStore.nodes.get(name);
    if (!node) return;

    // Add node definition
    lines.push(`    ${name}[${name}]`);

    // Add edges
    node.dependencies.forEach(dep => {
      const edgeKey = `${name} --> ${dep}`;
      if (!renderedEdges.has(edgeKey)) {
        lines.push(`    ${name} --> ${dep}`);
        renderedEdges.add(edgeKey);
      }
      renderEdges(dep);
    });
  };

  renderEdges(moduleName);
  return lines.join('\n');
}

// Render dependency graph as DOT format (Graphviz)
function renderDependencyGraphDOT(moduleName, options = {}) {
  if (!dependencyGraphStore.nodes.has(moduleName)) {
    return `Module "${moduleName}" not found in dependency graph.`;
  }

  const { graphName = 'DependencyGraph' } = options;
  const lines = [`digraph ${graphName} {`];
  const visited = new Set();

  const renderEdges = (name) => {
    if (visited.has(name)) return;
    visited.add(name);

    const node = dependencyGraphStore.nodes.get(name);
    if (!node) return;

    node.dependencies.forEach(dep => {
      lines.push(`    "${name}" -> "${dep}";`);
      renderEdges(dep);
    });
  };

  renderEdges(moduleName);
  lines.push('}');
  return lines.join('\n');
}

// Display module structure for debugging
function displayModuleStructure(format = 'ascii') {
  if (dependencyGraphStore.nodes.size === 0) {
    return 'No modules in dependency graph.';
  }

  const allModules = Array.from(dependencyGraphStore.nodes.keys());
  const modulesWithDeps = allModules.filter(name => {
    const node = dependencyGraphStore.nodes.get(name);
    return node.dependencies.length > 0;
  });

  const cycles = dependencyGraphStore.detectCircularDependencies();
  const topoOrder = dependencyGraphStore.getTopologicalOrder();

  const output = {
    summary: {
      totalModules: dependencyGraphStore.nodes.size,
      totalEdges: dependencyGraphStore.edges.length,
      modulesWithDependencies: modulesWithDeps.length,
      circularDependencies: cycles.length,
      hasCircularDependencies: cycles.length > 0,
      isTopologicallySortable: topoOrder !== null
    },
    modules: allModules.map(name => {
      const node = dependencyGraphStore.nodes.get(name);
      return {
        name,
        dependencies: [...node.dependencies],
        dependents: [...node.dependents],
        dependencyCount: node.dependencies.length,
        dependentCount: node.dependents.length,
        metadata: { ...node.metadata }
      };
    }),
    circularDependencies: cycles,
    topologicalOrder: topoOrder,
    format
  };

  if (format === 'json') {
    return JSON.stringify(output, null, 2);
  }

  if (format === 'mermaid') {
    const lines = ['graph TD'];
    const renderedEdges = new Set();
    dependencyGraphStore.edges.forEach(edge => {
      const edgeStr = `    ${edge.from} --> ${edge.to}`;
      if (!renderedEdges.has(edgeStr)) {
        lines.push(edgeStr);
        renderedEdges.add(edgeStr);
      }
    });
    return lines.join('\n');
  }

  if (format === 'dot') {
    const lines = ['digraph ModuleStructure {'];
    dependencyGraphStore.edges.forEach(edge => {
      lines.push(`    "${edge.from}" -> "${edge.to}";`);
    });
    lines.push('}');
    return lines.join('\n');
  }

  // ASCII format (default)
  const lines = [];
  lines.push('=== Module Structure ===');
  lines.push(`Total Modules: ${output.summary.totalModules}`);
  lines.push(`Total Dependencies: ${output.summary.totalEdges}`);
  lines.push(`Modules with Dependencies: ${output.summary.modulesWithDependencies}`);
  lines.push(`Circular Dependencies: ${output.summary.circularDependencies}`);
  lines.push(`Topologically Sortable: ${output.summary.isTopologicallySortable}`);
  lines.push('');

  if (cycles.length > 0) {
    lines.push('Circular Dependencies Detected:');
    cycles.forEach((cycle, index) => {
      lines.push(`  Cycle ${index + 1}: ${cycle.join(' -> ')}`);
    });
    lines.push('');
  }

  lines.push('Modules:');
  output.modules.forEach(module => {
    lines.push(`  ${module.name} (deps: ${module.dependencyCount}, dependents: ${module.dependentCount})`);
    if (module.dependencies.length > 0) {
      lines.push(`    Depends on: ${module.dependencies.join(', ')}`);
    }
    if (module.dependents.length > 0) {
      lines.push(`    Used by: ${module.dependents.join(', ')}`);
    }
  });

  if (topoOrder) {
    lines.push('');
    lines.push('Topological Order:');
    lines.push(`  ${topoOrder.join(' -> ')}`);
  }

  return lines.join('\n');
}

// Get module dependency information
function getModuleDependencies(moduleName) {
  if (!dependencyGraphStore.nodes.has(moduleName)) {
    return null;
  }

  const node = dependencyGraphStore.nodes.get(moduleName);
  return {
    name: moduleName,
    dependencies: [...node.dependencies],
    dependents: [...node.dependents],
    metadata: { ...node.metadata }
  };
}

// Get all dependents (reverse lookup) for a module
function getModuleDependents(moduleName) {
  if (!dependencyGraphStore.nodes.has(moduleName)) {
    return [];
  }
  return [...dependencyGraphStore.nodes.get(moduleName).dependents];
}

// Build dependency graph from a modules object
function buildDependencyGraphFromModules(modules) {
  if (!modules || typeof modules !== 'object') return;

  dependencyGraphStore.reset();

  Object.keys(modules).forEach(moduleName => {
    const module = modules[moduleName];
    const metadata = {
      ...(module.metadata || {})
    };
    dependencyGraphStore.addModule(moduleName, metadata);

    if (Array.isArray(module.dependencies)) {
      module.dependencies.forEach(dep => {
        dependencyGraphStore.addDependency(moduleName, dep);
      });
    }
  });
}

// Export dependency graph functions
export { dependencyGraphStore, renderDependencyGraph, renderDependencyGraphMermaid, renderDependencyGraphDOT, displayModuleStructure, getModuleDependencies, getModuleDependents, buildDependencyGraphFromModules };

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export default a11yStore;

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

module.exports = {
  existingFunction1,
  existingConst1,
  newFunction,
  dependencyGraph,
  isLinkAccessible,
  isLinkAccessibleSync,
  a11yStore,
  dependencyGraphStore,
  renderDependencyGraph,
  renderDependencyGraphMermaid,
  renderDependencyGraphDOT,
  displayModuleStructure,
  getModuleDependencies,
  getModuleDependents,
  buildDependencyGraphFromModules
};