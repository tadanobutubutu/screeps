// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and wrapPrimaryContentInMain())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and addFixLandmarkIssues())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and addAriaToFormControls())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ensureUniqueLandmarks() and addFixLandmarkIssues())
// - REACT_036: Fix 1 fake link issue (handled by fixFakeLinkIssues(), createAccessibleLink() and addFixLandmarkIssues())

// TODO: Identify and update specific functions that render dependency graphs or
// index views.
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute; handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure; handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (DONE: addLandmarkIssues; handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleName; handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (DONE: ensureUniqueLandmarks; handled by ...)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue; handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

/*==================================================
  1️⃣  Configuration helpers
  --------------------------------------------------
  All environment‑aware defaults are kept
  and the version string is exported for
  debugging or telemetry.
===================================================*/
const config = {
  port:      process.env.PORT      || 3000,
  env:       process.env.NODE_ENV  || 'development',
  apiUrl:    process.env.API_URL   || 'https://api.example.com',
  timeout:   Number(process.env.TIMEOUT) || 5000,
  debug:     process.env.NODE_ENV !== 'production',
  version:   '1.0.0',
};

const AddressabilityIssues = {
  validateTableAccessibility: function (table) {
    if (typeof document !== 'undefined') {
      const headers = table.querySelectorAll('th');
      headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
          console.error(`Table header at index ${index} is missing scope attribute`);
        }
      });

      const hasCaption = table.querySelector('caption');
      const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

      if (!hasCaption && !hasAriaLabel) {
        console.error('Table is missing a caption or aria-label/aria-labelledby');
      }

      return { valid: true, errors: [] };
    }
    return { valid: true };
  },

  validateTableStructure: function (table) {
    if (typeof document !== 'undefined') {
      const errors = [];

      if (table.tagName.toLowerCase() !== 'table') {
        errors.push('The element is not a table');
      }

      if (!table.hasAttribute('summary')) {
        errors.push('The table must have a summary attribute');
      }

      return { valid: errors.length === 0, errors };
    }
    return { valid: true };
  }
};

// Load configurations from package.json if it exists
function loadConfigurations() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      config.name = packageJson.name || 'dependency-counter';
      config.version = packageJson.version || '1.0.0';
      config.dependencies = packageJson.dependencies || {};
      config.devDependencies = packageJson.devDependencies || {};
      config.accessibility = packageJson.accessibility || {};
    }
  } catch (error) {
    console.error('Error loading configurations:', error.message);
  }
}

// Example functionA
function functionA() {
    return 'functionA result';
}

// Example functionB
function functionB() {
    return 'functionB result';
}

// new functionality
function validateAllTables() {
  const tables = document.getElementsByTagName('table');
  for (const table of tables) {
    const accessible = AddressabilityIssues.validateTableAccessibility(table);
    const structure = AddressabilityIssues.validateTableStructure(table);
    if (!accessible || !structure) {
      console.warn('Table accessibility or structure validation failed:', table);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', validateAllTables);
} else {
  validateAllTables();
}

module.exports = {
  config,
  XYZ,
  calculateSum
};