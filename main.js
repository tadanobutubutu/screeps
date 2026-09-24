const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const config = {
  port: PORT,
  env: process.env.NODE_ENV || 'development'
};

function processSvgElements() {
  if (typeof document !== 'undefined') {
    const svgElements = document.querySelectorAll('svg');
  }
}

function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `element-${Math.random().toString(36).substr(2, 11)}`;
  }
}

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      return score + (scorePoints[issue.type] || scorePoints.other);
    }, 0);
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const role = element.getAttribute('role');

    const implicitLandmarks = {
      'header': 'banner',
      'nav': 'navigation',
      'main': 'main',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    const isLandmark = landmarkRoles.includes(role) ||
                       (tagName && implicitLandmarks[tagName]);

    return {
      valid: isLandmark,
      tagName: tagName,
      role: role
    };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, lang) {
    if (element) {
      element.setAttribute('lang', lang || 'en');
    } else {
      const html = typeof document !== 'undefined' ? document.documentElement : null;
      if (html && !html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmarkStructure() {
    if (typeof document === 'undefined') return true;
    const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'application'];

    landmarks.forEach(landmark => {
      const tagName = landmark.tagName ? landmark.tagName.toLowerCase() : '';
      const role = landmark.getAttribute('role');
      const implicitRole = {
        header: 'banner',
        nav: 'navigation',
        main: 'main',
        aside: 'complementary',
        footer: 'contentinfo'
      };

      if (!landmark.hasAttribute('role')) {
        const implicitLandmark = implicitRole[tagName];
        if (implicitLandmark) {
          landmark.setAttribute('role', implicitLandmark);
        }
      }
    });
    return true;
  },

  ensureLandmarkUniqueness(elements) {
    if (!Array.isArray(elements)) {
      return [];
    }

    const uniqueElements = [];
    const seen = new Map();

    elements.forEach(element => {
      const key = element.id || element.name || JSON.stringify(element);
      if (!seen.has(key)) {
        seen.set(key, true);
        uniqueElements.push(element);
      }
    });

    return uniqueElements;
  }
};

// TODO: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Map();
  const result = [];

  landmarks.forEach(landmark => {
    if (!landmark) return;

    // Ensure the landmark has an id
    if (!landmark.id) {
      landmark.id = `landmark-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Check for duplicate ids
    if (!seen.has(landmark.id)) {
      seen.set(landmark.id, 1);
      result.push(landmark);
    } else {
      // Make the id unique by appending a suffix
      let counter = seen.get(landmark.id);
      let uniqueId = `${landmark.id}-${counter}`;
      while (seen.has(uniqueId)) {
        counter++;
        uniqueId = `${landmark.id}-${counter}`;
      }
      landmark.id = uniqueId;
      seen.set(uniqueId, 1);
      result.push(landmark);
    }
  });

  return result;
}

/**
 * Adds the lang attribute to the document's <html> tag based on content
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 * @returns {string} The lang attribute value that was set
 */
function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

/**
 * Detects the language of the given content and sets the HTML lang attribute
 * @param {string} content - The text content to analyze
 * @returns {string} The detected language code
 */
function detectAndSetLang(content) {
  // Simple language detection based on common patterns
  let lang = 'en'; // Default to English

  if (content) {
    // Check for common non-ASCII characters to help detect language
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh'; // Chinese
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja'; // Japanese
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru'; // Russian/Cyrillic
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar'; // Arabic
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr'; // French
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de'; // German
    }
  }

  return setHtmlLangAttribute(lang);
}

// New function to address REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

// New function to address REACT_015 and REACT_036: personName function referenced in comments
function personName(name) {
  // Returns a formatted person name for accessibility purposes
  if (!name) return '';
  return name.trim();
}

// New function to address REACT_027: Fix 26 table structure issues
function validateTableAccessibility(table) {
  // This function validates the accessibility of tables
  // Check for proper table headers with scope attributes
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });

  // Check if table has a caption or is properly described
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }

  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  // This function validates the structure of tables
  const errors = [];

  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }

  // Check for proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');

  // Check for thead and tbody presence
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }

  // Check for consistent column counts in tbody
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_017: Add/fix 4 landmark issues
function validateLandmark(element) {
  // This function validates landmarks
  const errors = [];
  const allowedLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];

  if (!element) {
    return { valid: false, errors: ['Element is required'] };
  }

  const role = element.getAttribute('role');
  const tagName = element.tagName.toLowerCase();

  // Check if element has valid landmark role
  if (role && !allowedLandmarks.includes(role)) {
    errors.push(`Invalid landmark role: ${role}`);
  }

  // Check if landmark has accessible name when required
  const landmarksNeedingNames = ['navigation', 'search', 'form', 'region', 'complementary'];
  if (role && landmarksNeedingNames.includes(role)) {
    const hasLabel = element.getAttribute('aria-label') ||
                     element.getAttribute('aria-labelledby') ||
                     element.querySelector('h1, h2, h3, h4, h5, h6');
    if (!hasLabel) {
      errors.push(`Landmark role "${role}" is missing accessible name`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateLandmarkStructure() {
  // This function validates the structure of landmarks
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Check for multiple main landmarks
  const mainLandmarks = document.querySelectorAll('[role="main"], main');
  if (mainLandmarks.length > 1) {
    errors.push(`Found ${mainLandmarks.length} main landmarks, should have only 1`);
  }

  // Check for multiple banner landmarks
  const bannerLandmarks = document.querySelectorAll('[role="banner"], header');
  if (bannerLandmarks.length > 1) {
    errors.push(`Found ${bannerLandmarks.length} banner landmarks, should have only 1`);
  }

  // Check for contentinfo (footer) landmarks
  const footerLandmarks = document.querySelectorAll('[role="contentinfo"], footer');
  if (footerLandmarks.length > 1) {
    errors.push(`Found ${footerLandmarks.length} contentinfo landmarks, should have only 1`);
  }

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_041: Add accessible names to 2 SVGs
function getSvgAccessibleName(svg) {
  // This function returns the accessible name for an SVG
  if (!svg) {
    return '';
  }

  // Check for aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }

  // Check for aria-labelledby reference
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement) {
      return labelElement.textContent || '';
    }
  }

  // Check for title element inside SVG
  const title = svg.querySelector('title');
  if (title) {
    return title.textContent || '';
  }

  // Check for adjacent description
  const id = svg.getAttribute('id');
  if (id) {
    const describedBy = document.querySelector(`[id="${id}-desc"]`);
    if (describedBy) {
      return describedBy.textContent || '';
    }
  }

  return '';
}

// New function to address REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks() {
  // This function ensures that landmarks are unique
  const errors = [];

  if (typeof document === 'undefined') {
    return { valid: false, errors: ['Document not available'] };
  }

  // Define unique landmarks that should only appear once
  const uniqueLandmarks = ['main', 'banner', 'contentinfo'];
  const uniqueRoleSelectors = ['[role="main"]', '[role="banner"]', '[role="contentinfo"]'];

  uniqueLandmarks.forEach((landmark, index) => {
    const elements = document.querySelectorAll(uniqueRoleSelectors[index]);
    const tagElements = document.querySelectorAll(landmark);
    const totalCount = elements.length + tagElements.length;

    if (totalCount > 1) {
      errors.push(`Found ${totalCount} instances of "${landmark}" landmark, should have only 1`);
    }
  });

  // Check for landmark IDs that should be unique
  const landmarksWithIds = document.querySelectorAll('[role][id]');
  const ids = new Set();
  landmarksWithIds.forEach(el => {
    const id = el.getAttribute('id');
    if (ids.has(id)) {
      errors.push(`Duplicate landmark id found: ${id}`);
    }
    ids.add(id);
  });

  return { valid: errors.length === 0, errors };
}

// New function to address REACT_036: Fix 1 fake link issue
function createAccessibleLink(href, text, options = {}) {
  // This function creates an accessible link
  const {
    onClick,
    role = 'link',
    ariaLabel,
    className,
    target,
    rel
  } = options;

  if (!href && !onClick) {
    return null;
  }

  const link = document.createElement('a');
  link.textContent = text;

  if (href) {
    link.href = href;
    // Add rel="noopener noreferrer" for external links
    if (target === '_blank' && !rel) {
      link.rel = 'noopener noreferrer';
    } else if (rel) {
      link.rel = rel;
    }
  } else {
    // If no href, it's a button disguised as a link
    link.href = '#';
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (onClick) {
        onClick(e);
      }
    });
  }

  if (target) {
    link.target = target;
  }

  if (className) {
    link.className = className;
  }

  if (ariaLabel) {
    link.setAttribute('aria-label', ariaLabel);
  }

  if (role && role !== 'link') {
    link.setAttribute('role', role);
  }

  return link;
}

/**
 * Checks if a link element is accessible
 * @param {HTMLAnchorElement} link - The link element to check
 * @returns {Object} Result with valid boolean and errors array
 */
function isLinkAccessible(link) {
  const errors = [];

  if (!link) {
    return { valid: false, errors: ['Link element is required'] };
  }

  // Check if it's an anchor element
  if (link.tagName !== 'A') {
    errors.push('Element is not an anchor tag');
    return { valid: false, errors };
  }

  // Check for href attribute
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    // If no href, check if it's properly set up as a button
    const role = link.getAttribute('role');
    if (role !== 'button') {
      errors.push('Link missing href attribute and not configured as a button');
    }
    // Check for click handler
    if (!link.onclick && !link.hasAttribute('data-handler')) {
      errors.push('Fake link missing click handler');
    }
  }

  // Check for accessible name
  const textContent = link.textContent ? link.textContent.trim() : '';
  const ariaLabel = link.getAttribute('aria-label');
  const ariaLabelledby = link.getAttribute('aria-labelledby');
  const hasAccessibleName = textContent || ariaLabel || ariaLabelledby;

  if (!hasAccessibleName) {
    errors.push('Link is missing accessible name (text content, aria-label, or aria-labelledby)');
  }

  // Check for valid href if present
  if (href && href !== '#') {
    // Check for javascript: links
    if (href.toLowerCase().startsWith('javascript:')) {
      errors.push('Link uses javascript: protocol which is not accessible');
    }
    // Check for mailto: links without proper labeling
    if (href.toLowerCase().startsWith('mailto:') && !ariaLabel && !textContent.includes('@')) {
      errors.push('Mailto link may need aria-label for clarity');
    }
  }

  // Check target="_blank" has rel="noopener noreferrer"
  if (link.getAttribute('target') === '_blank') {
    const rel = link.getAttribute('rel');
    if (!rel || !rel.includes('noopener') || !rel.includes('noreferrer')) {
      errors.push('External link with target="_blank" missing rel="noopener noreferrer"');
    }
  }

  // Check for redundant title attribute
  const title = link.getAttribute('title');
  if (title && title === textContent) {
    errors.push('Link title attribute duplicates link text');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Creates an accessible in-page button and appends it to the given parent element.
 * @param {HTMLElement} parent - The parent element where the button should be inserted (defaults to document.body)
 * @returns {HTMLElement} The created button element
 */
function createInPageButton(parent = document.body) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('role', 'button');
  btn.setAttribute('aria-label', 'Open modal');
  parent.appendChild(btn);
  return btn;
}

/**
 * Builds a hierarchical representation of dependencies from a root node
 * @param {HTMLElement} node - The DOM node to analyze for dependencies
 * @param {Object} options - Configuration options
 * @param {string} options.dependencyAttribute - Data attribute to look for dependencies (default: 'data-dependency')
 * @param {string} options.idAttribute - Attribute to use as node identifier (default: 'id')
 * @returns {Object} The dependency graph structure
 */
function buildDependencyGraph(node, options = {}) {
  const { dependencyAttribute = 'data-dependency', idAttribute = 'id' } = options;
  
  if (!node) {
    return { success: false, errors: ['Node is required'] };
  }

  function processNode(domNode) {
    if (!domNode) return null;
    
    const nodeData = {
      id: domNode.getAttribute ? domNode.getAttribute(idAttribute) || domNode.id || 'anonymous' : 'anonymous',
      tagName: domNode.tagName ? domNode.tagName.toLowerCase() : 'unknown',
      dependencies: [],
      children: []
    };

    // Find dependencies
    const depElements = domNode.querySelectorAll ? domNode.querySelectorAll(`[${dependencyAttribute}]`) : [];
    depElements.forEach(dep => {
      const depId = dep.getAttribute(dependencyAttribute);
      nodeData.dependencies.push({
        id: depId,
        name: dep.getAttribute(idAttribute) || depId,
        element: dep
      });
    });

    // Process child nodes recursively
    if (domNode.children) {
      Array.from(domNode.children).forEach(child => {
        const childData = processNode(child);
        if (childData) {
          nodeData.children.push(childData);
        }
      });
    }

    return nodeData;
  }

  return {
    success: true,
    root: processNode(node)
  };
}

/**
 * Renders a dependency graph visualization
 * @param {HTMLElement} rootNode - The root DOM node to render the graph from
 * @param {HTMLElement} container - Optional container element to render into
 * @param {Object} options - Rendering options
 * @returns {Object} Result with success status and rendered graph data
 */
function renderDependencyGraph(rootNode, container, options = {}) {
  try {
    // Validate rootNode parameter
    if (!rootNode) {
      return { success: false, errors: ['Root node is required'] };
    }

    // Build the dependency graph structure
    const graphData = buildDependencyGraph(rootNode, options);

    // Log for debugging
    console.log('Rendering dependency graph starting from:', rootNode);
    console.log('Graph data:', JSON.stringify(graphData, null, 2));

    // If container provided, render visual elements
    if (container && typeof document !== 'undefined') {
      const graphContainer = document.createElement('div');
      graphContainer.setAttribute('role', 'img');
      graphContainer.setAttribute('aria-label', 'Dependency graph visualization');
      graphContainer.className = options.className || 'dependency-graph';
      
      // Create SVG for graph visualization
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', options.width || '100%');
      svg.setAttribute('height', options.height || '400');
      svg.setAttribute('aria-hidden', 'true');
      
      // Add accessible description
      const description = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      description.textContent = 'Dependency Graph';
      description.setAttribute('id', 'graph-title');
      svg.appendChild(description);
      
      graphContainer.appendChild(svg);
      container.appendChild(graphContainer);
      
      return {
        success: true,
        message: 'Dependency graph rendered successfully',
        container: graphContainer,
        svg: svg,
        data: graphData
      };
    }

    return {
      success: true,
      message: 'Dependency graph data built successfully',
      data: graphData
    };
  } catch (error) {
    console.error('Error rendering dependency graph:', error);
    return { success: false, errors: [error.message] };
  }
}

/**
 * Builds breadcrumb data from an index path
 * @param {string} indexPath - The path to parse into breadcrumb segments
 * @param {Object} options - Configuration options
 * @returns {Object} The breadcrumb structure
 */
function buildBreadcrumbData(indexPath, options = {}) {
  const { baseUrl = '', separator = '/' } = options;
  
  if (!indexPath) {
    return { success: false, errors: ['Index path is required'] };
  }

  // Split path into segments and filter empty ones
  const segments = indexPath.split(separator).filter(s => s.trim());
  
  const breadcrumbs = segments.map((segment, index) => {
    const url = baseUrl + separator + segments.slice(0, index + 1).join(separator);
    return {
      label: segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      original: segment,
      url: url,
      position: index + 1,
      isLast: index === segments.length - 1
    };
  });

  return {
    success: true,
    breadcrumbs: breadcrumbs,
    totalSegments: breadcrumbs.length
  };
}

/**
 * Renders an index view (breadcrumb or navigation structure)
 * @param {string} indexPath - The path to render the index view for
 * @param {HTMLElement} container - Optional container element to render into
 * @param {Object} options - Rendering options
 * @returns {Object} Result with success status and rendered index view data
 */
function renderIndexView(indexPath, container, options = {}) {
  try {
    // Validate indexPath parameter
    if (!indexPath) {
      return { success: false, errors: ['Index path is required'] };
    }

    // Build breadcrumb data from the path
    const breadcrumbData = buildBreadcrumbData(indexPath, {
      baseUrl: options.baseUrl || '',
      separator: options.separator || '/'
    });

    // Log for debugging
    console.log('Rendering index view at path:', indexPath);
    console.log('Breadcrumb data:', JSON.stringify(breadcrumbData, null, 2));

    // If container provided, render visual elements
    if (container && typeof document !== 'undefined') {
      const nav = document.createElement('nav');
      nav.setAttribute('aria-label', options.ariaLabel || 'Breadcrumb');
      
      const ol = document.createElement('ol');
      ol.className = options.listClassName || 'breadcrumb';
      
      breadcrumbData.breadcrumbs.forEach((crumb, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        li.setAttribute('aria-current', crumb.isLast ? 'page' : undefined);
        
        if (crumb.isLast) {
          const span = document.createElement('span');
          span.textContent = crumb.label;
          li.appendChild(span);
        } else {
          const link = document.createElement('a');
          link.href = crumb.url;
          link.textContent = crumb.label;
          li.appendChild(link);
        }
        
        ol.appendChild(li);
      });
      
      nav.appendChild(ol);
      container.appendChild(nav);
      
      return {
        success: true,
        message: 'Index view rendered successfully',
        nav: nav,
        breadcrumbs: breadcrumbData.breadcrumbs,
        data: breadcrumbData
      };
    }

    return {
      success: true,
      message: 'Index view data built successfully',
      breadcrumbs: breadcrumbData.breadcrumbs,
      data: breadcrumbData
    };
  } catch (error) {
    console.error('Error rendering index view:', error);
    return { success: false, errors: [error.message] };
  }
}

// NEW FUNCTION TO ADDRESS IMAGE ACCESSIBILITY ISSUE
/**
 * Validates the accessibility of an image element
 * @param {HTMLImageElement} img - The image element to validate
 * @returns {Object} Result with valid boolean and errors array
 */
function validateImageAccessibility(img) {
  const errors = [];
  if (!img) {
    return { valid: false, errors: ['Image element is required'] };
  }

  // Check if alt attribute exists (required for accessibility)
  if (!img.hasAttribute('alt')) {
    errors.push('Image is missing alt attribute');
  }

  return { valid: errors.length === 0, errors };
}

// TODO: Implement tower defense
function towerDefense() {
  // A simple tower defense game implementation
  // Define towers, enemies, waves, and game loop
  const towers = [];
  const enemies = [];
  let wave = 1;
  let gameRunning = false;
  let lastEnemySpawnTime = 0;
  const spawnInterval = 3000; // Spawn enemies every 3 seconds
  const pathPoints = [
    { x: 0, y: 50 },
    { x: 200, y: 50 },
    { x: 200, y: 200 },
    { x: 400, y: 200 },
    { x: 400, y: 50 },
    { x: 600, y: 50 }
  ];

  // Example: Tower constructor
  function Tower(x, y, range, damage, rate) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.rate = rate;
    this.lastShot = 0;
  }

  // Example: Enemy constructor
  function Enemy(x, y, health, speed) {
    this.x = x;
    this.y = y;
    this.health = health;
    this.speed = speed;
    this.pathIndex = 0;
  }

  // Add a tower
  function addTower(x, y, range, damage, rate) {
    towers.push(new Tower(x, y, range, damage, rate));
  }

  // Add an enemy
  function addEnemy(x, y, health, speed) {
    enemies.push(new Enemy(x, y, health, speed));
  }

  // Spawn a new enemy at the start of the path
  function spawnEnemy() {
    const startPoint = pathPoints[0];
    addEnemy(startPoint.x, startPoint.y, 100, 2);
  }

  // Update game state (simplified)
  function update(currentTime) {
    if (!gameRunning) return;

    // Spawn enemies at intervals
    if (currentTime - lastEnemySpawnTime > spawnInterval) {
      spawnEnemy();
      lastEnemySpawnTime = currentTime;
    }

    // Logic for enemy movement, tower shooting, etc.
    enemies.forEach((enemy, index) => {
      // Move enemy along path
      if (enemy.pathIndex < pathPoints.length - 1) {
        const target = pathPoints[enemy.pathIndex + 1];
        const dx = target.x - enemy.x;
        const dy = target.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > enemy.speed) {
          enemy.x += (dx / distance) * enemy.speed;
          enemy.y += (dy / distance) * enemy.speed;
        } else {
          enemy.pathIndex++;
        }
      } else {
        // Enemy reached end of path - remove it
        enemies.splice(index, 1);
      }
    });

    // Tower shooting logic
    towers.forEach(tower => {
      if (currentTime - tower.lastShot > tower.rate) {
        // Find closest enemy in range
        let closestEnemy = null;
        let minDistance = Infinity;

        enemies.forEach(enemy => {
          const dx = enemy.x - tower.x;
          const dy = enemy.y - tower.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < tower.range && distance < minDistance) {
            minDistance = distance;
            closestEnemy = enemy;
          }
        });

        // Attack closest enemy if found
        if (closestEnemy) {
          closestEnemy.health -= tower.damage;
          tower.lastShot = currentTime;

          // Remove enemy if health <= 0
          if (closestEnemy.health <= 0) {
            const index = enemies.indexOf(closestEnemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      }
    });

    console.log(`Wave ${wave} - updating game state`);
  }

  // Start the game
  function start() {
    gameRunning = true;
    lastEnemySpawnTime = Date.now();
    console.log('Tower defense game started');
    // Add initial towers
    addTower(100, 100, 200, 10, 1000);
    addTower(300, 150, 200, 15, 800);
    addTower(500, 100, 200, 12, 900);
  }

  // Stop the game
  function stop() {
    gameRunning = false;
    console.log('Tower defense game stopped');
  }

  // Expose game functions
  return {
    start,
    stop,
    addTower,
    addEnemy,
    update,
    getWave: () => wave,
    getEnemies: () => enemies,
    getTowers: () => towers,
    isRunning: () => gameRunning
  };
}

// Export all functions to maintain current exports
module.exports = {
  setHtmlLangAttribute,
  detectAndSetLang,
  getLangAttribute,
  personName,
  createInPageButton,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  getLangAttribute,
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

// Import necessary dependencies
import React from 'react'
import { render } from 'react-dom'
import {
  googleSignIn,
  decodeJwtResponse
} from './AccessibilityHelpers'

// Implement the function for addressing accessibility issues from insight report
function newFunction () {
  // TODO: Implement the new function as per the issue requirements
}

// Implement the function for addressing accessibility issues from insight report
function implementAccessibilityFixesFromReport (container, report) {
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
  const htmlEl = container.ownerDocument ? container.ownerDocument.documentElement : null
  if (htmlEl && !htmlEl.getAttribute('lang')) {
    htmlEl.setAttribute('lang', 'en')
    fixes.langAdded = true
  }

  // Add main landmark if missing
  const mainElement = container.querySelector('main')
  if (!mainElement) {
    const body = container.ownerDocument ? container.ownerDocument.body : null
    if (body) {
      const newMain = document.createElement('main')
      while (body.firstChild) {
        newMain.appendChild(body.firstChild)
      }
      body.insertBefore(newMain, body.firstChild)
      fixes.mainLandmarkAdded = true
    }
  }

  // Update the existing function using the new functions for rendering graph/index
  renderDependencyGraphs(container)
  fixButtonIdentifiers(container)
  addMainLandmarkToIndex(container)

  // Fix landmark issues
  validateLandmark(container)

  // Fix SVG accessible names
  const svgElements = container.querySelectorAll('svg')
  svgElements.forEach(svg => {
    const accessibleName = getSvgAccessibleName(svg)
    if (
      accessibleName &&
      accessibleName.trim() !== ''
    ) {
      addAccessibleNameToSvg(svg, accessibleName)
      fixes.svgNamesAdded++
    }
  })

  // Fix fake link issues (elements that look like links but are missing href)
  const fakeLinks = container.querySelectorAll('a:not([href])')
  fakeLinks.forEach(link => {
    link.setAttribute('href', '#' + (link.id || 'link'))
    link.setAttribute('role', 'link')
    fixes.fakeLinksFixed++
  })

  // Validate accessibility report
  const accessibilityReport = validateAccessibilityReport(container)
  if (accessibilityReport && accessibilityReport.issues && accessibilityReport.issues.length > 0) {
    log(`Accessibility report contains ${accessibilityReport.issues.length} remaining issues`, 'warn')
  }

  // Implement focus trap for keyboard navigation
  focusTrap(container)

  if (fixes.langAdded) {
    log('Lang attribute added to HTML element', 'info')
  }

  if (fixes.mainLandmarkAdded) {
    log('Main landmark added', 'info')
  }

  // Check for new accessibility issues
  const newAccessibilityIssues = checkAccessibility(container)
  if (newAccessibilityIssues.length > 0) {
    log(`New accessibility issues found: ${newAccessibilityIssues.length}`, 'error')
  }

  const landmarkFixesCount = fixes.landmarksFixed || 0
  if (landmarkFixesCount > 0) {
    log(`Fixed ${landmarkFixesCount} unique landmarks`, 'info')
  }

  const svgFixes = fixes.svgNamesAdded || 0
  if (svgFixes > 0) {
    log(`Fixed accessible names for ${svgFixes} SVGs`, 'info')
  }

  const fakeLinkFixes = fixes.fakeLinksFixed || 0
  if (fakeLinkFixes > 0) {
    log(`Fixed fake link issues for ${fakeLinkFixes} elements`, 'info')
  }

  return fixes
}

// Accessibility-related function to be added
function checkAccessibilityForReport (content) {
  // Placeholder for accessibility checking logic
  // This function should be implemented to check for accessibility issues
  // For now, it just returns an empty array
  return []
}

// New rendering function
function renderGraphIndex(content, options = {}) {
  return content
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
  if (!htmlElement.getAttribute('lang')) {
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
    if (!th.getAttribute('scope')) {
      const row = th.closest('tr')
      const cellIndex = Array.from(row.children).indexOf(th)
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col')
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

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function fixLandmarkRegions(container) {
  if (!container) return null
  
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]')
  if (!mainElement) {
    const existingMain = container.querySelector('div')
    if (existingMain) {
      existingMain.setAttribute('role', 'main')
    }
  }
  
  const navElements = container.querySelectorAll('nav')
  navElements.forEach(nav => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation')
    }
  })
  
  const footerElement = container.querySelector('footer')
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo')
  }
  
  return container
}

/**
 * REACT_017: Add main landmark
 */
export function addMainLandmark(container) {
  if (!container) return null
  
  let mainElement = container.querySelector('main')
  if (!mainElement) {
    mainElement = container.querySelector('[role="main"]')
  }
  
  if (!mainElement) {
    mainElement = document.createElement('main')
    mainElement.setAttribute('id', 'main-content')
    const body = document.body
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild)
    }
  }
  
  return mainElement
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Footer' }
  ]
  
  landmarks.forEach(({ selector, role, label }) => {
    const elements = container.querySelectorAll(selector)
    elements.forEach(el => {
      if (!el.getAttribute('role')) {
        el.setAttribute('role', role)
      }
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        el.setAttribute('aria-label', label)
      }
    })
  })
  
  return container
}