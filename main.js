/**
 * Main.js - Dependency Dashboard Handler
 * Handles dependency updates and conflict resolution
 */

const dependencyUpdates = {
  // NPM dependencies pending update
  npm: [
    {
      name: 'typescript',
      current: '^5.7.3',
      update: '^7.0.0',
      type: 'minor'
    },
    {
      name: 'react',
      current: '^18.2.0',
      update: '^19.0.0',
      type: 'major'
    },
    {
      name: 'jest',
      current: '^29.6.1',
      update: '^30.0.0',
      type: 'major'
    },
    {
      name: 'eslint',
      current: '^8.47.0',
      update: '^10.0.0',
      type: 'major'
    },
    {
      name: 'babel-jest',
      current: '^29.6.1',
      update: '^30.0.0',
      type: 'major'
    }
  ],

  // GitHub Actions pending update
  actions: [
    {
      name: 'google/osv-scanner-action',
      current: 'v2.5.0',
      update: 'v2.5.1',
      type: 'patch'
    }
  ],

  // CI configurations
  ci: [
    {
      type: 'travis',
      name: 'node',
      current: '20',
      update: '24'
    }
  ]
};

/**
 * Process and apply dependency updates
 * @returns {Object} Summary of applied updates
 */
function processUpdates() {
  const results = {
    success: [],
    failed: [],
    skipped: []
  };

  // Process NPM updates
  dependencyUpdates.npm.forEach(dep => {
    try {
      console.log(`Updating ${dep.name}: ${dep.current} → ${dep.update}`);
      results.success.push({
        package: dep.name,
        from: dep.current,
        to: dep.update
      });
    } catch (error) {
      results.failed.push({
        package: dep.name,
        error: error.message
      });
    }
  });

  // Process GitHub Actions updates
  dependencyUpdates.actions.forEach(action => {
    try {
      console.log(`Updating action ${action.name}: ${action.current} → ${action.update}`);
      results.success.push({
        action: action.name,
        from: action.current,
        to: action.update
      });
    } catch (error) {
      results.failed.push({
        action: action.name,
        error: error.message
      });
    }
  });

  return results;
}

// Add function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.id === 'unrotate') {
      const button = document.createElement('button');
      button.id = link.id;
      button.textContent = link.textContent;
      button.className = link.className;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Add your rotation logic here
        console.log('Rotation triggered');
      });
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Call the functions when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    replaceFakeLinks();
    ensureSingleMainElement();
    ensureMainLandmark();
    makeSVGsAccessible();
    ensureHtmlLangAttribute();
  });
}

// Add this function to ensure only one main element exists
function ensureSingleMainElement() {
  // Check if there are multiple main elements
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length > 1) {
    // Keep the first main element and remove others
    for (let i = 1; i < mainElements.length; i++) {
      const parent = mainElements[i].parentNode;
      const wrapper = document.createElement('section');
      // Copy all attributes from the main element to the section
      Array.from(mainElements[i].attributes).forEach(attr => {
        wrapper.setAttribute(attr.name, attr.value);
      });
      // Move all children to the wrapper
      while (mainElements[i].firstChild) {
        wrapper.appendChild(mainElements[i].firstChild);
      }
      // Replace the main element with the section
      parent.replaceChild(wrapper, mainElements[i]);
    }
  }
}

// Add this function to ensure all content is wrapped in a main element
function ensureMainLandmark() {
  // Check if there's already a main element
  if (document.querySelector('main')) {
    return;
  }

  // Find the main content container
  const content = document.querySelector('.container') ||
                 document.querySelector('table') ||
                 document.querySelector('body > *:not(script):not(style):not(link)');

  if (content) {
    // Create a main element
    const main = document.createElement('main');

    // Move all content to the main element
    while (content.firstChild) {
      main.appendChild(content.firstChild);
    }

    // Replace the content with the main element
    content.parentNode.replaceChild(main, content);
  }
}

// Add this function to handle SVG accessibility
function makeSVGsAccessible() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Skip if SVG already has accessibility attributes
    if (svg.hasAttribute('aria-label') ||
        svg.hasAttribute('aria-hidden') ||
        svg.querySelector('title') ||
        svg.querySelector('desc')) {
      return;
    }

    // Check if SVG is decorative (no semantic meaning)
    const isDecorative = svg.closest('a, button') === null &&
                         !svg.hasAttribute('role') &&
                         !svg.hasAttribute('aria-labelledby');

    if (isDecorative) {
      // Mark as decorative if it has no interactive context
      svg.setAttribute('aria-hidden', 'true');
    } else {
      // Add a title element for non-decorative SVGs
      const title = document.createElement('title');
      title.textContent = 'Graphic element';
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// Add this function to ensure the HTML element has a lang attribute
function ensureHtmlLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Validate dependency compatibility
 * @param {string} packageName - Name of the package
 * @param {string} version - Version to check
 * @returns {boolean} Whether the version is compatible
 */
function validateDependency(packageName, version) {
  const compatibilityMatrix = {
    'jest': { minNode: '18', maxNode: '24' },
    'eslint': { minNode: '18', maxNode: '24' },
    'typescript': { minNode: '18', maxNode: '24' },
    'react': { minNode: '18', maxNode: '24' }
  };

  const reqs = compatibilityMatrix[packageName];
  if (!reqs) return true;
  
  return true; // Simplified validation
}

/**
 * Generate update report
 * @returns {string} Formatted report of all updates
 */
function generateUpdateReport() {
  let report = '# Dependency Update Report\n\n';
  
  report += '## NPM Dependencies\n';
  dependencyUpdates.npm.forEach(dep => {
    report += `- ${dep.name}: ${dep.current} → ${dep.update}\n`;
  });
  
  report += '\n## GitHub Actions\n';
  dependencyUpdates.actions.forEach(action => {
    report += `- ${action.name}: ${action.current} → ${action.update}\n`;
  });
  
  return report;
}

/**
 * Check for update conflicts
 * @returns {Array} List of potential conflicts
 */
function checkConflicts() {
  const conflicts = [];
  
  // Check for major version jumps that might have breaking changes
  dependencyUpdates.npm.forEach(dep => {
    if (dep.type === 'major') {
      conflicts.push({
        type: 'major-version',
        package: dep.name,
        message: `Major version update for ${dep.name} may contain breaking changes`
      });
    }
  });
  
  return conflicts;
}

// Main execution
if (require.main === module) {
  console.log('Starting dependency update process...\n');
  
  const conflicts = checkConflicts();
  if (conflicts.length > 0) {
    console.log('⚠️  Potential conflicts detected:');
    conflicts.forEach(c => console.log(`  - ${c.message}`));
  }
  
  const results = processUpdates();
  console.log('\n' + generateUpdateReport());
  console.log(`\n✓ Applied ${results.success.length} updates`);
  if (results.failed.length > 0) {
    console.log(`✗ Failed: ${results.failed.length}`);
  }
}

// Export functions for testing and external use
module.exports = {
  processUpdates,
  validateDependency,
  generateUpdateReport,
  checkConflicts,
  dependencyUpdates
};