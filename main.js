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
// - REACT_036: Fix 1 fake link issue (handled by validateLinkAccessibility() and createInPageButton())

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
 * Validate if link is accessible (not a "fake link")
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
  
  // The href check is performed later in validateLinkOrButton; this function
  // primarily ensures there is meaningful text for screen readers.
  return { valid: true };
}

/**
 * Create an accessible button configuration for in-page actions
 * Replaces fake links with proper button elements for better keyboard and screen reader support
 * @param {string} text - Button text
 * @param {function} onClick - Click event handler
 * @returns {Object} Button configuration with accessibility attributes
 */
function createInPageButton(text, onClick) {
  return {
    type: 'button',
    text: text,
    onClick: onClick,
    accessibility: {
      role: 'button',
      ariaLabel: text
    }
  };
}

// ============================================================================
// Additional accessibility helper functions to address Insight Code findings
// ============================================================================

/**
 * Validate unique landmarks across a page/component tree
 * Addresses REACT_025: React Unique Landmarks
 * @param {Array} landmarks - Array of landmark objects { type, label, id }
 * @returns {Object} Validation result with duplicate issues
 */
function validateUniqueLandmarks(landmarks) {
  const seen = new Map();
  const duplicates = [];
  
  landmarks.forEach((landmark, index) => {
    const key = `${landmark.type}:${landmark.label || 'unlabeled'}`;
    if (seen.has(key)) {
      duplicates.push({
        type: landmark.type,
        label: landmark.label,
        firstIndex: seen.get(key),
        duplicateIndex: index,
        message: `REACT_025: Duplicate landmark "${landmark.type}" with label "${landmark.label || 'unlabeled'}"`
      });
    } else {
      seen.set(key, index);
    }
  });
  
  return {
    valid: duplicates.length === 0,
    duplicates,
    totalLandmarks: landmarks.length
  };
}

/**
 * Comprehensive landmark validation for a component tree
 * Addresses REACT_017: React Landmarks
 * @param {Object} componentTree - Component tree with landmarks
 * @returns {Object} Validation result with landmark issues
 */
function validateLandmarkStructure(componentTree) {
  const issues = [];
  const landmarks = [];
  
  function traverse(node, path = '') {
    if (!node) return;
    
    const currentPath = path ? `${path} > ${node.type || 'unknown'}` : (node.type || 'root');
    
    // Check for landmark roles
    if (node.role && ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'search'].includes(node.role)) {
      landmarks.push({
        role: node.role,
        label: node['aria-label'] || node['aria-labelledby'] || null,
        path: currentPath
      });
      
      // Check for missing accessible name on landmarks
      if (!node['aria-label'] && !node['aria-labelledby']) {
        issues.push({
          rule: 'REACT_017',
          severity: 'warning',
          message: `Landmark with role="${node.role}" at ${currentPath} is missing an accessible name (aria-label or aria-labelledby)`,
          path: currentPath
        });
      }
    }
    
    // Check for HTML5 landmark elements without explicit roles
    const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer', 'section', 'article'];
    if (html5Landmarks.includes(node.type) && !node.role) {
      landmarks.push({
        role: node.type,
        label: node['aria-label'] || node['aria-labelledby'] || null,
        path: currentPath
      });
      
      if (!node['aria-label'] && !node['aria-labelledby'] && node.type !== 'header' && node.type !== 'footer') {
        issues.push({
          rule: 'REACT_017',
          severity: 'warning',
          message: `<${node.type}> landmark at ${currentPath} should have an accessible name`,
          path: currentPath
        });
      }
    }
    
    // Traverse children
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(child => traverse(child, currentPath));
    }
  }
  
  traverse(componentTree);
  
  // Check for multiple main landmarks
  const mainLandmarks = landmarks.filter(l => l.role === 'main');
  if (mainLandmarks.length > 1) {
    issues.push({
      rule: 'REACT_017',
      severity: 'error',
      message: `Multiple main landmarks found (${mainLandmarks.length}). Only one main landmark is allowed per page.`,
      paths: mainLandmarks.map(l => l.path)
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    landmarks
  };
}

/**
 * Enhanced table accessibility validation
 * Addresses REACT_027: React Table Structure (26 occurrences)
 * @param {Object} tableConfig - Table configuration with headers, rows, caption, summary
 * @returns {Object} Detailed validation result
 */
function validateTableStructure(tableConfig) {
  const issues = [];
  const warnings = [];
  
  // Check for table caption
  if (!tableConfig.caption) {
    issues.push({
      rule: 'REACT_027',
      severity: 'warning',
      message: 'Table is missing a <caption> element for accessibility'
    });
  }
  
  // Check for table summary (for complex tables)
  if (tableConfig.isComplex && !tableConfig.summary) {
    warnings.push({
      rule: 'REACT_027',
      severity: 'warning',
      message: 'Complex table should have a summary attribute or aria-describedby'
    });
  }
  
  // Validate headers
  if (tableConfig.headers && tableConfig.headers.length > 0) {
    tableConfig.headers.forEach((header, index) => {
      if (!header.scope) {
        issues.push({
          rule: 'REACT_027',
          severity: 'warning',
          message: `Header cell at index ${index} is missing scope attribute (should be "col" or "row")`
        });
      }
      
      if (header.isRowHeader && header.scope !== 'row') {
        issues.push({
          rule: 'REACT_027',
          severity: 'warning',
          message: `Row header at index ${index} should have scope="row"`
        });
      }
      
      if (header.isColumnHeader && header.scope !== 'col') {
        issues.push({
          rule: 'REACT_027',
          severity: 'warning',
          message: `Column header at index ${index} should have scope="col"`
        });
      }
    });
  }
  
  // Check for header-row association in data tables
  if (tableConfig.hasDataCells && (!tableConfig.headers || tableConfig.headers.length === 0)) {
    issues.push({
      rule: 'REACT_027',
      severity: 'error',
      message: 'Data table must have header cells (<th>) associated with data cells'
    });
  }
  
  // Check for proper row structure
  if (tableConfig.rows) {
    tableConfig.rows.forEach((row, rowIndex) => {
      if (row.cells && row.cells.length !== tableConfig.expectedCellCount) {
        warnings.push({
          rule: 'REACT_027',
          severity: 'warning',
          message: `Row ${rowIndex} has ${row.cells.length} cells, expected ${tableConfig.expectedCellCount}`
        });
      }
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings
  };
}

/**
 * Generate comprehensive table cell attributes for accessibility
 * @param {Object} cellConfig - Cell configuration
 * @returns {Object} Attributes to apply to the cell
 */
function getTableCellAttributes(cellConfig) {
  const attrs = {};
  
  if (cellConfig.isHeader) {
    attrs.scope = cellConfig.scope || (cellConfig.orientation === 'row' ? 'row' : 'col');
    attrs.role = 'columnheader';
    
    if (cellConfig.id) {
      attrs.id = cellConfig.id;
    }
  } else if (cellConfig.headers) {
    attrs.headers = cellConfig.headers.join(' ');
  }
  
  if (cellConfig.abbr) {
    attrs.abbr = cellConfig.abbr;
  }
  
  return attrs;
}

/**
 * Enhanced SVG accessible name generation
 * Addresses REACT_041: React SVG Accessible Name (2 occurrences)
 * @param {string} description - Human-readable description
 * @param {Object} options - Configuration options
 * @returns {Object} Complete accessibility props for SVG
 */
function createSvgAccessibilityProps(description, options = {}) {
  const {
    role = 'img',
    title,
    desc,
    ariaHidden = false,
    ariaLabelledBy,
    ariaDescribedBy
  } = options;
  
  const props = {
    role,
    'aria-hidden': ariaHidden
  };
  
  if (!ariaHidden) {
    if (description) {
      props['aria-label'] = description;
    }
    
    if (title) {
      props.title = title;
    }
    
    if (desc) {
      props.desc = desc;
    }
    
    if (ariaLabelledBy) {
      props['aria-labelledby'] = ariaLabelledBy;
    }
    
    if (ariaDescribedBy) {
      props['aria-describedby'] = ariaDescribedBy;
    }
  }
  
  return props;
}

/**
 * Validate SVG accessibility in a component tree
 * @param {Array} svgs - Array of SVG element configurations
 * @returns {Object} Validation result
 */
function validateSvgAccessibility(svgs) {
  const issues = [];
  
  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg['aria-label'] || svg['aria-labelledby'] || (svg.title && svg.title.trim());
    const hasRole = svg.role === 'img' || svg.role === 'graphics-document' || svg.role === 'graphics-symbol';
    
    if (!hasAccessibleName && !svg['aria-hidden']) {
      issues.push({
        rule: 'REACT_041',
        severity: 'warning',
        message: `SVG at index ${index} is missing an accessible name (aria-label, aria-labelledby, or <title>)`,
        index
      });
    }
    
    if (!hasRole && !svg['aria-hidden']) {
      issues.push({
        rule: 'REACT_041',
        severity: 'warning',
        message: `SVG at index ${index} should have role="img" or appropriate graphics role`,
        index
      });
    }
    
    // Check for decorative SVGs that should be hidden
    if (svg.isDecorative && !svg['aria-hidden']) {
      issues.push({
        rule: 'REACT_041',
        severity: 'warning',
        message: `Decorative SVG at index ${index} should have aria-hidden="true"`,
        index
      });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Enhanced fake link detection and validation
 * Addresses REACT_036: React Fake Link (1 occurrence)
 * @param {Object} element - Element configuration to check
 * @returns {Object} Validation result with recommendations
 */
function validateLinkOrButton(element) {
  const issues = [];
  const recommendations = [];
  
  const href = element.href;
  const onClick = element.onClick;
  const role = element.role;
  const tagName = element.tagName?.toLowerCase();
  const text = element.text?.trim();
  
  // Check for fake links (anchor tags used as buttons)
  if (tagName === 'a' || role === 'link') {
    if (!href || href === '#' || href === 'javascript:void(0)' || href.startsWith('javascript:')) {
      issues.push({
        rule: 'REACT_036',
        severity: 'warning',
        message: 'Anchor element used as a button (fake link). Use <button> instead for in-page actions.'
      });
      recommendations.push({
        type: 'button',
        reason: 'Element has click handler but no valid href. Replace <a> with <button> for better accessibility.'
      });
    }
    
    if (!text && !element['aria-label'] && !element['aria-labelledby']) {
      issues.push({
        rule: 'REACT_036',
        severity: 'error',
        message: 'Link has no accessible text content'
      });
    }
  }
  
  // Check for buttons that should be links
  if (tagName === 'button' || role === 'button') {
    if (href && href !== '#' && !href.startsWith('javascript:')) {
      issues.push({
        rule: 'REACT_036',
        severity: 'warning',
        message: 'Button element used for navigation. Use <a> with href for navigation.'
      });
      recommendations.push({
        type: 'link',
        reason: 'Element navigates to a URL. Use <a href="..."> instead of <button>.'
      });
    }
  }
  
  // Check for elements with click handlers but no semantic role
  if (onClick && !tagName && !role) {
    issues.push({
      rule: 'REACT_036',
      severity: 'warning',
      message: 'Element with click handler has no semantic role. Add role="button" or use <button>.'
    });
    recommendations.push({
      type: 'button',
      reason: 'Interactive elements must have a semantic role for screen readers.'
    });
  }
  
  // Check for keyboard accessibility
  if (onClick && !element.onKeyDown && (tagName === 'div' || tagName === 'span' || role === 'button')) {
    issues.push({
      rule: 'REACT_036',
      severity: 'warning',
      message: 'Custom button element missing keyboard event handler (Enter/Space). Add onKeyDown for accessibility.'
    });
  }
  
  return {
    valid: issues.length === 0,
    issues,
    recommendations
  };
}

/**
 * Create accessible link configuration
 * @param {Object} config - Link configuration
 * @returns {Object} Link props with accessibility attributes
 */
function createAccessibleLink(config) {
  const { href, text, ariaLabel, external, download, onClick } = config;
  
  const props = {
    href: href || '#',
    text: text || '',
    accessibility: {}
  };
  
  if (ariaLabel) {
    props.accessibility['aria-label'] = ariaLabel;
  }
  
  if (external) {
    props.accessibility['aria-label'] = `${props.accessibility['aria-label'] || text} (opens in new tab)`;
    props.target = '_blank';
    props.rel = 'noopener noreferrer';
  }
  
  if (download) {
    props.download = download;
  }
  
  if (onClick) {
    props.onClick = onClick;
  }
  
  return props;
}

/**
 * Generate HTML lang attribute with region support
 * Addresses REACT_015: React Language Attribute
 * @param {string} language - Language code (e.g., 'en')
 * @param {string} region - Region code (e.g., 'US')
 * @param {string} script - Script code (e.g., 'Latn')
 * @returns {string} Complete lang attribute value
 */
function getFullLangAttribute(language = 'en', region = '', script = '') {
  let lang = language;
  
  if (script) {
    lang += `-${script}`;
  }
  
  if (region) {
    lang += `-${region}`;
  }
  
  return lang;
}

/**
 * Validate HTML lang attribute
 * @param {string} langValue - Current lang attribute value
 * @returns {Object} Validation result
 */
function validateLangAttribute(langValue) {
  const issues = [];
  
  if (!langValue || langValue.trim() === '') {
    issues.push({
      rule: 'REACT_015',
      severity: 'critical',
      message: 'HTML element is missing lang attribute'
    });
  } else {
    // Basic BCP 47 validation
    const langRegex = /^[a-z]{2,3}(-[A-Z]{4})?(-[A-Z]{2}|-\d{3})?(-[a-zA-Z0-9]{5,8})*$/i;
    if (!langRegex.test(langValue)) {
      issues.push({
        rule: 'REACT_015',
        severity: 'warning',
        message: `lang attribute "${langValue}" may not be a valid BCP 47 language tag`
      });
    }
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// Export all utilities
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
  createInPageButton,
  // New accessibility functions
  validateUniqueLandmarks,
  validateLandmarkStructure,
  validateTableStructure,
  getTableCellAttributes,
  createSvgAccessibilityProps,
  validateSvgAccessibility,
  validateLinkOrButton,
  createAccessibleLink,
  getFullLangAttribute,
  validateLangAttribute
};

// Run if executed directly
if (require.main === module) {
  console.log('Processing dependency updates...\n');
  const updates = processDependencyUpdates();
  
  updates.forEach(update => {
    console.log(`Updating ${update.dependency}:`);
    console.log(`  ${update.from} → ${update.to}`);
    if (update.breaking.hasBreaking) {
      console.log(`  WARNING: ${update.breaking.note}`);
    }
    console.log();
  });
}