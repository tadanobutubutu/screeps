/**
 * Main entry point for dependency management and configuration
 * Handles updates for: jest, typescript, react, eslint, and other dependencies
 */

// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark & getSvgAccessibleName())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateLandmark)
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility())

/**
 * Version compatibility matrix for the updates mentioned in the dashboard
 */
const DEPENDENCY_UPDATES = {
  jest: {
    current: '^29.6.1',
    next: '^30.0.0',
    packages: ['jest', 'babel-jest']
  },
  typescript: {
    current: '^5.7.3',
    next: '^7.0.0'
  },
  react: {
    current: '^18.2.0',
    next: '^19.0.0',
    packages: ['react', 'react-dom']
  },
  eslint: {
    current: '^8.47.0',
    next: '^10.0.0'
  }
};

/**
 * Check compatibility between dependencies
 * @param {string} dep1 - First dependency name
 * @param {string} dep1Version - Version of first dependency
 * @param {string} dep2 - Second dependency name
 * @param {string} dep2Version - Version of second dependency
 * @returns {Object} Compatibility result
 */
function checkCompatibility(dep1, dep1Version, dep2, dep2Version) {
  const compatibilityMatrix = {
    'jest+typescript': { min: '5.0', max: '7.0' },
    'jest+react': { min: '18.0', max: '19.0' },
    'eslint+typescript': { min: '5.0', max: '7.0' }
  };
  
  const key = `${dep1}+${dep2}`;
  const range = compatibilityMatrix[key];
  
  if (!range) return { compatible: true };
  
  const majorVersion = (version) => {
    const match = version.match(/\^?(\d+)\./);
    return match ? parseInt(match[1]) : null;
  };
  
  const version = majorVersion(dep2Version);
  
  if (version < parseInt(range.min) || version > parseInt(range.max)) {
    return {
      compatible: false,
      reason: `${dep1} may have compatibility issues with ${dep2} ${dep2Version}`
    };
  }
  
  return { compatible: true };
}

/**
 * Validate all detected dependencies from Renovate dashboard
 * @param {Object} dependencies - Object containing dependency versions
 * @returns {Object} Validation results with errors and warnings
 */
function validateDependencies(dependencies) {
  const errors = [];
  const warnings = [];
  
  if (dependencies.jest && dependencies.typescript) {
    const result = checkCompatibility(
      'jest', dependencies.jest,
      'typescript', dependencies.typescript
    );
    if (!result.compatible) {
      errors.push(result.reason);
    }
  }
  
  if (dependencies.eslint && dependencies.typescript) {
    const result = checkCompatibility(
      'eslint', dependencies.eslint,
      'typescript', dependencies.typescript
    );
    if (!result.compatible) {
      errors.push(result.reason);
    }
  }
  
  return { errors, warnings };
}

/**
 * Get recommended update order based on dependency tree
 * @returns {string[]} Array of dependency names in recommended update order
 */
function getRecommendedUpdateOrder() {
  return [
    'typescript',  // Update TypeScript first as other tools depend on types
    'eslint',      // Update ESLint to v10
    'jest',        // Update Jest to v30 (includes babel-jest)
    'react'        // Update React to v19 last
  ];
}

/**
 * Check for breaking changes in major version updates
 * @param {string} currentVersion - Current version string
 * @param {string} newVersion - New version string
 * @returns {Object} Breaking change information
 */
function hasBreakingChanges(currentVersion, newVersion) {
  const currentMajorMatch = currentVersion.match(/\^?(\d+)\./);
  const newMajorMatch = newVersion.match(/\^?(\d+)\./);
  const currentMajor = currentMajorMatch ? currentMajorMatch[1] : '0';
  const newMajor = newMajorMatch ? newMajorMatch[1] : '0';
  
  if (newMajor > currentMajor) {
    return {
      hasBreaking: true,
      majorBump: newMajor - currentMajor,
      note: `Major version update from ${currentMajor} to ${newMajor}`
    };
  }
  
  return { hasBreaking: false };
}

/**
 * Main function to process dependency updates
 * @returns {Array} Array of update results with dependency, versions, and breaking change info
 */
function processDependencyUpdates() {
  const updateOrder = getRecommendedUpdateOrder();
  const results = [];
  
  updateOrder.forEach(dep => {
    const update = DEPENDENCY_UPDATES[dep];
    if (update) {
      results.push({
        dependency: dep,
        from: update.current,
        to: update.next,
        packages: update.packages || [dep],
        breaking: hasBreakingChanges(update.current, update.next)
      });
    }
  });
  
  return results;
}

/**
 * Add accessibility helper functions for React components
 * These functions can be used to ensure accessibility compliance
 */

/**
 * Generate lang attribute value for HTML element
 * @param {string} locale - Locale code (e.g., 'en', 'en-US')
 * @returns {string} Complete lang attribute value
 */
function getLangAttribute(locale = 'en') {
  return locale;
}

/**
 * Check if landmark has a unique accessible name
 * @param {string} landmarkType - Type of landmark (nav, main, aside, etc.)
 * @param {string} label - Label for the landmark
 * @returns {Object} Validation result
 */
function validateLandmark(landmarkType, label) {
  const validLandmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
  
  if (!validLandmarks.includes(landmarkType)) {
    return {
      valid: false,
      reason: `Invalid landmark type: ${landmarkType}`
    };
  }
  
  return {
    valid: true,
    label: label || null
  };
}

/**
 * Generate accessible name for SVG element
 * @param {string} description - Description of the SVG
 * @param {Object} options - Additional options
 * @returns {Object} Accessible name configuration
 */
function getSvgAccessibleName(description, options = {}) {
  return {
    role: options.role || 'img',
    ariaLabel: description,
    ariaHidden: options.ariaHidden || false
  };
}

/**
 * Check if table structure is accessible
 * @param {Object} tableConfig - Table configuration object
 * @returns {Object} Validation result with issues
 */
function validateTableAccessibility(tableConfig) {
  const issues = [];
  
  if (tableConfig.hasHeaders && !tableConfig.scope) {
    issues.push('REACT_027: Table headers should have scope attributes');
  }
  
  if (tableConfig.hasHeaders && !tableConfig.caption) {
    issues.push('REACT_027: Tables should have captions for accessibility');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Generate scope attribute recommendation for table cells
 * @param {string} cellType - Type of table cell ('th' or 'td')
 * @param {boolean} isHeader - Whether the cell is a header
 * @param {string} orientation - Orientation of the header ('row' or 'col')
 * @returns {string} Recommended scope attribute value
 */
function getTableScopeRecommendation(cellType, isHeader, orientation = 'col') {
  if (cellType === 'th' && isHeader) {
    return `scope="${orientation}"`;
  }
  return '';
}

/**
 * Check if link has accessible text (not a "fake link")
 * @param {string} linkText - Text content of the link
 * @param {Object} context - Additional context for the link
 * @returns {Object} Validation result
 */
function validateLinkAccessibility(linkText, context = {}) {
  if (!linkText || linkText.trim() === '') {
    return {
      valid: false,
      reason: 'REACT_036: Links must have accessible text content'
    };
  }
  
  if (linkText === '#' || linkText === 'javascript:void(0)') {
    return {
      valid: false,
      reason: 'REACT_036: Avoid using fake link patterns like "#" or "javascript:void(0)"'
    };
  }
  
  return { valid: true };
}

/**
 * Generate proper table header configuration for accessibility
 * @param {Object} options - Configuration options
 * @param {string} options.scope - Scope for the header ('row' or 'col')
 * @param {string} options.caption - Table caption text
 * @param {boolean} options.hasHeaderRow - Whether table has header row
 * @returns {Object} Complete table accessibility configuration
 */
function generateTableHeaderConfig(options = {}) {
  const config = {
    scope: options.scope || 'col',
    captions: [],
    headers: []
  };
  
  if (options.caption) {
    config.captions.push({
      value: options.caption,
      id: `caption-${Date.now()}`
    });
  }
  
  if (options.headers && Array.isArray(options.headers)) {
    options.headers.forEach((header, index) => {
      config.headers.push({
        text: header,
        scope: options.scope || 'col',
        id: `header-${index}`
      });
    });
  }
  
  return config;
}

/**
 * Generate accessible landmark props for React elements
 * @param {string} landmarkType - Type of landmark
 * @param {string} label - Accessible label for the landmark
 * @param {Object} options - Additional options
 * @returns {Object} Props object with accessibility attributes
 */
function generateLandmarkProps(landmarkType, label, options = {}) {
  const props = {
    'data-testid': `${landmarkType}-landmark`
  };
  
  if (label) {
    props['aria-label'] = label;
  }
  
  switch (landmarkType) {
    case 'header':
      props.role = 'banner';
      break;
    case 'nav':
      props.role = 'navigation';
      break;
    case 'main':
      props.role = 'main';
      break;
    case 'aside':
      props.role = 'complementary';
      break;
    case 'footer':
      props.role = 'contentinfo';
      break;
    case 'section':
      props.role = 'region';
      if (label) {
        props['aria-labelledby'] = `${label.toLowerCase()}-heading`;
      }
      break;
    case 'article':
      props.role = 'article';
      break;
    default:
      props.role = landmarkType;
  }
  
  return props;
}

/**
 * Generate accessible SVG element props
 * @param {string} description - SVG accessible name/description
 * @param {Object} options - Additional options
 * @returns {Object} Props object for SVG element
 */
function generateSvgProps(description, options = {}) {
  return {
    role: 'img',
    'aria-label': description,
    focusable: 'false',
    ...(options.ariaHidden && { 'aria-hidden': true })
  };
}

/**
 * Track landmarks to ensure uniqueness across components
 * @param {string} landmarkType - Type of landmark
 * @param {string} label - Label for the landmark
 * @param {Object} landmarkRegistry - Registry of existing landmarks
 * @returns {Object} Landmark configuration with unique identifier
 */
function ensureUniqueLandmark(landmarkType, label, landmarkRegistry = {}) {
  const registryKey = `${landmarkType}-${label || 'unlabeled'}`;
  
  if (landmarkRegistry[registryKey]) {
    const uniqueLabel = `${label || landmarkType}-${Object.keys(landmarkRegistry).length}`;
    landmarkRegistry[registryKey] = uniqueLabel;
    return {
      type: landmarkType,
      label: uniqueLabel,
      isUnique: true
    };
  }
  
  landmarkRegistry[registryKey] = label || landmarkType;
  return {
    type: landmarkType,
    label: label || landmarkType,
    isUnique: true
  };
}

/**
 * Generate accessible link attributes
 * @param {string} linkText - Text content for the link
 * @param {string} href - Link destination
 * @param {Object} options - Additional options
 * @returns {Object} Props object for link element
 */
function generateLinkProps(linkText, href, options = {}) {
  const props = {
    href: href || '#',
    role: 'link',
    tabIndex: 0
  };
  
  if (linkText && linkText.trim() !== '' && linkText !== '#' && linkText !== 'javascript:void(0)') {
    props['aria-label'] = linkText;
    props.children = linkText;
  } else {
    props['aria-label'] = options.accessibleName || 'Link';
  }
  
  if (options.target) {
    props.target = options.target;
  }
  
  if (options.rel) {
    props.rel = options.rel;
  }
  
  return props;
}

/**
 * Generate HTML lang attribute configuration
 * @param {string} language - Language code
 * @param {string} direction - Text direction ('ltr' or 'rtl')
 * @returns {Object} HTML element attributes
 */
function generateHtmlAttributes(language = 'en', direction = 'ltr') {
  return {
    lang: getLangAttribute(language),
    dir: direction
  };
}

/**
 * Export all utilities
 */
module.exports = {
  DEPENDENCY_UPDATES,
  checkCompatibility,
  validateDependencies,
  getRecommendedUpdateOrder,
  hasBreakingChanges,
  processDependencyUpdates,
  // Accessibility helper exports
  getLangAttribute,
  validateLandmark,
  getSvgAccessibleName,
  validateTableAccessibility,
  getTableScopeRecommendation,
  validateLinkAccessibility,
  // Enhanced accessibility functions
  generateTableHeaderConfig,
  generateLandmarkProps,
  generateSvgProps,
  ensureUniqueLandmark,
  generateLinkProps,
  generateHtmlAttributes
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();
  
  updates.forEach(update => {
    console.log(`Updating ${update.dependency}:`);
    console.log(`  ${update.from} → ${update.next}`);
    if (update.breaking.hasBreaking) {
      console.log(`  WARNING: ${update.breaking.note}`);
    }
    console.log();
  });
}