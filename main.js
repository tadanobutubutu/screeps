const {
  createInPageButton,
  createWebResourceButton,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  ensureUniqueLandmarks,
  createAccessibleLink,
  isLinkAccessible,
  renderDependencyGraph,
  renderIndexView,
  buildDependencyGraph,
  buildBreadcrumbData,
  validateAccessibilityReport,
  exportUtils,
  addressAccessibilityIssues,
  ensureElementHasId,
  ensureElementHasIdOrigin,
  addAriaLabel,
  renderDependencyGraphs,
  fixButtonIdentifiers,
  fixDependencyGraphAria,
  addMainLandmarkToIndex,
  focusTrap,
  checkAccessibility
} = main

/**
 * Creates an accessible button/link for external web resources (e.g., GitHub, Stack Overflow, etc.)
 * @param {Object} options - Configuration options for the web resource button
 * @param {string} options.url - The URL to link to
 * @param {string} options.label - The accessible label/name for the button (required for screen readers)
 * @param {string} options.icon - Optional icon class name or SVG markup to display
 * @param {string} options.type - Type of resource (e.g., 'github', 'stackoverflow', 'twitter', 'linkedin')
 * @param {string} options.variant - Button variant style (e.g., 'primary', 'secondary', 'icon-only')
 * @param {string} options.className - Additional CSS class names
 * @param {boolean} options.openInNewTab - Whether to open link in new tab (default: true for external resources)
 * @param {string} options.ariaDescription - Additional aria-description for more context
 * @returns {HTMLAnchorElement|HTMLButtonElement} - The accessible web resource button element
 */
export function createWebResourceButton(options = {}) {
  const {
    url,
    label,
    icon,
    type,
    variant = 'secondary',
    className = '',
    openInNewTab = true,
    ariaDescription
  } = options;

  // Validate required parameters
  if (!url || typeof url !== 'string') {
    console.warn('createWebResourceButton: URL is required and must be a string');
    return null;
  }

  if (!label || typeof label !== 'string') {
    console.warn('createWebResourceButton: Label is required for accessibility and must be a string');
    return null;
  }

  // Create the anchor element for external links
  const button = document.createElement('a');
  
  // Set core attributes
  button.href = url;
  button.textContent = label;
  
  // Ensure accessible name for screen readers
  button.setAttribute('aria-label', label);
  
  // Handle external link accessibility
  if (openInNewTab || url.startsWith('http://') || url.startsWith('https://')) {
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    // Announce that link opens in new tab for screen reader users
    button.setAttribute('aria-describedby', 'external-link-description');
  }

  // Add type-specific class for styling
  if (type) {
    button.classList.add(`web-resource-btn`, `web-resource-btn--${type.toLowerCase()}`);
  }

  // Add variant class
  button.classList.add(`btn`, `btn--${variant}`);
  
  // Add any additional custom classes
  if (className) {
    const additionalClasses = className.split(' ').filter(c => c.trim());
    additionalClasses.forEach(c => button.classList.add(c));
  }

  // Add icon if provided
  if (icon) {
    if (icon.startsWith('<')) {
      // SVG markup - insert as HTML
      button.innerHTML = icon + label;
    } else {
      // Icon class - wrap in span
      const iconSpan = document.createElement('span');
      iconSpan.className = icon;
      iconSpan.setAttribute('aria-hidden', 'true');
      button.insertBefore(iconSpan, button.firstChild);
    }
  }

  // Add additional aria-description if provided
  if (ariaDescription) {
    button.setAttribute('aria-description', ariaDescription);
  }

  // Ensure keyboard accessibility
  button.tabIndex = 0;
  
  // Add Enter key support for keyboard activation
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  return button;
}

/**
 * wrapPrimaryContentInMain - Wraps the primary content of a container in a <main> element
 * This ensures proper landmark structure for accessibility compliance
 * @param {HTMLElement} container - The container element to process
 * @param {Object} options - Optional configuration options
 * @param {string} options.mainId - Custom id for the main element (default: 'main-content')
 * @param {string} options.mainRole - Role attribute for the main element (default: 'main')
 * @returns {HTMLElement|null} - The main element or null if operation failed
 */
export function wrapPrimaryContentInMain(container, options = {}) {
  if (!container || typeof container !== 'object' || !container.nodeType) {
    return null;
  }

  const config = {
    mainId: options.mainId || 'main-content',
    mainRole: options.mainRole || 'main'
  };

  // Check if main element already exists
  let mainElement = container.querySelector('main');

  if (mainElement) {
    // Main element already exists, ensure it has proper id
    if (!mainElement.id) {
      mainElement.id = config.mainId;
    }
    // Ensure proper role
    if (!mainElement.getAttribute('role')) {
      mainElement.setAttribute('role', config.mainRole);
    }
    return mainElement;
  }

  // Create new main element
  mainElement = document.createElement('main');
  mainElement.id = config.mainId;
  mainElement.setAttribute('role', config.mainRole);

  // Find primary content to wrap
  // Priority: role="main" > main element > article > section with id > body content
  const primarySelectors = [
    '[role="main"]',
    'article:not([role])',
    'section[id]',
    '.primary-content',
    '#primary-content',
    '.main-content',
    '#main-content'
  ];

  let primaryContent = null;

  for (const selector of primarySelectors) {
    primaryContent = container.querySelector(selector);
    if (primaryContent) {
      break;
    }
  }

  if (primaryContent) {
    // Move primary content children into main element
    while (primaryContent.firstChild) {
      mainElement.appendChild(primaryContent.firstChild);
    }

    // Replace primary content with main element
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  } else {
    // No specific primary content found
    // Get body or container's direct children
    const body = container.ownerDocument ? container.ownerDocument.body : null;
    const contentParent = body || container;

    // Collect direct children to move
    const childrenToMove = Array.from(contentParent.childNodes).filter(node => {
      // Skip script, style, and meta elements
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        if (['script', 'style', 'link', 'meta', 'noscript'].includes(tagName)) {
          return false;
        }
        // Skip existing main element
        if (tagName === 'main') {
          return false;
        }
      }
      return true;
    });

    // Move children to main element
    childrenToMove.forEach(child => {
      mainElement.appendChild(child);
    });

    // Append main element to container
    if (body) {
      body.appendChild(mainElement);
    } else {
      container.appendChild(mainElement);
    }
  }

  // Log successful operation
  if (typeof log === 'function') {
    log(`Primary content wrapped in main element with id: ${config.mainId}`, 'info');
  }

  return mainElement;
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport(container, report) {
  const fixes = {
    langAdded: false,
    mainLandmarkAdded: false,
    landmarksFixed: 0,
    svgNamesAdded: 0,
    fakeLinksFixed: 0
  }

  if (!report || !report.issues) {
    return fixes
  }

  // Add lang attribute to HTML element if missing
  const htmlEl = document.querySelector('html') || container.ownerDocument.documentElement
  if (htmlEl && !htmlEl.hasAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('[role="main"], main')
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : null
    if (body) {
      const newMain = document.createElement('main')
      body.insertBefore(newMain, body.firstChild)
      addMainLandmarkToIndex(newMain)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  ...

  // Fix landmark issues
  validateLandmark(container)
  ...
  fixes.landmarksFixed++

  // Fix SVG accessible names
  const svgElements = ...
  ... => {
    const accessibleName = getSvgAccessibleName(svg)
    if (accessibleName) {
      addAriaLabel(svg, accessibleName)
    }
    fixes.svgNamesAdded++
  })

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a[href^="#"]:not([role="link"])')
  fakeLinks.forEach((link) => {
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  })

  // Validate accessibility report
  const accessibilityReport = checkAccessibility(container)
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    console.warn(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`)
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container)

  if (fixes.langAdded) {
    console.info('Lang attribute added to HTML element')
  }

  if (fixes.mainLandmarkAdded) {
    console.info('Main landmark added')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container)
  if (newAccessibilityIssues.length > 0) {
    console.error(`New accessibility issues found: ${newAccessibilityIssues.join(', ')}`)
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    console.info(`Fixed ${landmarkFixesCount} unique landmarks`)
  }

  const svgFixes = fixes.svgNamesAdded || 0
  if (svgFixes > 0) {
    console.info(`Fixed accessible names for ${svgFixes} SVGs`)
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0
  if (fakeLinkFixes > 0) {
    console.info(`Fixed fake link issues for ${fakeLinkFixes} elements`)
  }

  return fixes
}

function validateSession() {
  // Implementation of the validateSession function
  // Placeholder for actual implementation
  return false
}

function handleCredentialResponse(response) {
  // Implementation of the handleCredentialResponse function
  // Process the credential response and extract relevant information
  
  if (!response) {
    console.warn('No credential response provided');
    return { success: false };
  }
  
  // Extract token from various possible locations in the response
  const token = response.token || 
                response.access_token || 
                response.auth_token || 
                response.credentials?.token;
  
  if (!token) {
    console.warn('No valid token found in credential response');
    return { success: false };
  }
  
  // Optionally decode the JWT token if needed
  // Using the existing decodeJwtResponse helper
  // Note: This would typically happen before storing the token
  // For now, we'll just log it
  
  console.log('Credential Response processed successfully');
  console.log('Extracted token:', token);
  
  return { success: true, token };
}

// New function to handle additional rendering logic
// @param {Object} additionalData - Additional data for rendering
// @returns {string} Rendered additional content HTML
function renderAdditionalContent(additionalData) {
  // Implementation of the new function
  // Placeholder for actual implementation
  return ''
}

// Accessibility-related function to be added
function checkAccessibilityForReport(content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return []
}

/**
 * Renders dependency graphs for the given container
 * @param {HTMLElement} container - The container element to render dependency graphs in
 * @param {Object} options - Rendering options
 * @returns {HTMLElement} The rendered graph element
 */
export function renderDependencyGraphs(container, options = {}) {
  if (!container) {
    console.warn('No container provided for dependency graph rendering')
    return null
  }

  const {
    graphType = 'dependency',
    showLabels = true,
    interactive = true
  } = options

  // Find or create a container for the dependency graph
  let graphContainer = container.querySelector('[data-dependency-graph]')
  if (!graphContainer) {
    graphContainer = document.createElement('div')
    graphContainer.setAttribute('data-dependency-graph', 'true')
    graphContainer.setAttribute('role', 'img')
    graphContainer.setAttribute('aria-label', `Dependency graph showing ${graphType} relationships`)
    container.appendChild(graphContainer)
  }

  // Add accessible attributes based on options
  if (showLabels) {
    graphContainer.setAttribute('aria-label', `Dependency graph: ${graphType} visualization`)
  }

  if (interactive) {
    graphContainer.setAttribute('tabindex', '0')
    graphContainer.setAttribute('role', 'application')
  }

  return graphContainer
}

/**
 * Renders the graph index with proper accessibility
 * @param {string} content - The content to render
 * @param {Object} options - Rendering options
 * @returns {string} Rendered content HTML
 */
export function renderGraphIndex(content, options = {}) {
  if (!content) {
    return ''
  }

  const {
    includeGraph = true,
    accessibilityLabel = 'Dependency graph index'
  } = options

  // If content is already HTML, return it with accessibility attributes
  if (typeof content === 'string' && content.includes('<')) {
    // Wrap in accessible container
    return `<div class="graph-index" role="region" aria-label="${accessibilityLabel}">
      ${includeGraph ? `<div class="graph-container" data-graph-index="true">${content}</div>` : content}
    </div>`
  }

  // For non-HTML content, create structured output
  return `<div class="graph-index" role="region" aria-label="${accessibilityLabel}">
    ${includeGraph ? `<div class="graph-container" data-graph-index="true">${content}</div>` : content}
  </div>`
}

// Helper to manage focus within a container
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  return function(e) {
    const isTab = e.key === 'Tab'
    if (!isTab) return
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        if (lastElement) lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        if (firstElement) firstElement.focus()
      }
    }
  }
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement
  if (!htmlElement) {
    return null
  }

  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang)
  }
  return htmlElement
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null

  const headers = tableElement.querySelectorAll('th')
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', 'col')
    }
  })

  const existingCaption = tableElement.querySelector('caption')
  if (!existingCaption) {
    const caption = document.createElement('caption')
    caption.textContent = 'Data table'
    tableElement.insertBefore(caption, tableElement.firstChild)
  }

  return tableElement
}

// Function to create in-page buttons
function createInPageButton(text, container = document.body, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  if (options.id) {
    button.id = options.id;
  }
  if (options.className) {
    button.className = options.className;
  }
  if (options.ariaLabel) {
    button.setAttribute('aria-label', options.ariaLabel);
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  container.appendChild(button);
  return button;
}

// Add the new function to the exports
module.exports.renderAdditionalContent = renderAdditionalContent
module.exports.implementAccessibilityFixesFromReport = implementAccessibilityFixesFromReport
module.exports.checkAccessibilityForReport = checkAccessibilityForReport
module.exports.renderGraphIndex = renderGraphIndex
module.exports.trapFocus = trapFocus
module.exports.createInPageButton = createInPageButton