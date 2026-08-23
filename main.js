// TODO: Address accessibility issues from insight report: 
// - REACT_015: Add lang attribute to HTML element 
// - REACT_017: Add/fix 4 landmark issues 
// - REACT_025: Ensure unique landmarks (2 issues) 
// - REACT_036: Fix 1 fake link issue 

/**
 * Generates content for a dependency graph visualization
 * @param {Object} dependencies - The dependencies object to generate graph content from
 * @returns {string} - The generated dependency graph content as a string
 */
const dependencyGraphContent = (dependencies = {}) => {
  if (!dependencies || typeof dependencies !== 'object') {
    return '';
  }

  const nodes = Object.keys(dependencies).map(dep => ({
    id: dep,
    label: dep,
    type: 'dependency'
  }));

  const edges = Object.entries(dependencies).flatMap(([source, targets]) => {
    if (!Array.isArray(targets)) return [];
    return targets.map(target => ({
      source,
      target,
      type: 'dependency-link'
    }));
  });

  return JSON.stringify({ nodes, edges }, null, 2);
};

/**
 * Generates index content for navigation or documentation purposes
 * @param {Array} items - Array of items to include in the index
 * @param {Object} options - Optional configuration for index generation
 * @returns {string} - The generated index content
 */
const indexContent = (items = [], options = {}) => {
  if (!Array.isArray(items)) {
    return '';
  }

  const { format = 'json', includeMetadata = true } = options;
  
  const indexItems = items.map((item, idx) => {
    const baseIndex = {
      order: idx + 1,
      name: item.name || item.title || item,
      slug: item.slug || String(item).toLowerCase().replace(/\s+/g, '-') || String(idx)
    };

    if (includeMetadata && item.metadata) {
      baseIndex.metadata = item.metadata;
    }

    return baseIndex;
  });

  return format === 'json' ? JSON.stringify(indexItems, null, 2) : indexItems;
};

const mainFunc = () => {
  // ... existing functionality ...
};

const newFunc = () => {
  // ... new functionality ...
};

// REACT_015: Add lang attribute to HTML element
// Ensures the HTML document has a proper lang attribute for screen readers
const addLangAttribute = (htmlContent = '', lang = 'en') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }
  
  // Check if lang attribute already exists
  if (/<html[^>]*lang=/.test(htmlContent)) {
    return htmlContent.replace(/lang="[^"]*"/, `lang="${lang}"`);
  }
  
  // Add lang attribute to html tag
  return htmlContent.replace(/<html([^>]*)>/, `<html$1 lang="${lang}">`);
};

// REACT_017: Add/fix 4 landmark issues
// Adds main landmark to the content for proper page structure
const addMainLandmark = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }
  
  // Check if main landmark already exists
  if (/<main[^>]*>/.test(htmlContent) || /<div[^>]*role="main"[^>]*>/.test(htmlContent)) {
    return htmlContent;
  }
  
  // Add role="main" to the most appropriate container or wrap main content
  return htmlContent.replace(
    /(<body[^>]*>)([\s\S]*)(<\/body>)/,
    '$1$2<div role="main">$3</div>'
  );
};

// REACT_025: Ensure unique landmarks (2 issues)
// Ensures only one header and one footer with landmark roles exist
const ensureUniqueLandmarks = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }
  
  let result = htmlContent;
  
  // Ensure only one header landmark - convert subsequent headers to non-landmark
  const headerMatches = result.match(/<header[^>]*>/g) || [];
  if (headerMatches.length > 1) {
    let headerCount = 0;
    result = result.replace(/<header[^>]*>/g, (match) => {
      headerCount++;
      return headerCount === 1 ? match : match.replace(/role="banner"/, '');
    });
  }
  
  // Ensure only one footer landmark - convert subsequent footers to non-landmark
  const footerMatches = result.match(/<footer[^>]*>/g) || [];
  if (footerMatches.length > 1) {
    let footerCount = 0;
    result = result.replace(/<footer[^>]*>/g, (match) => {
      footerCount++;
      return footerCount === 1 ? match : match.replace(/role="contentinfo"/, '');
    });
  }
  
  return result;
};

// REACT_036: Fix 1 fake link issue
// Adds proper accessible name to divs acting as links
const addAriaLabelToMyDiv = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }
  
  // Find divs with role="link" that lack accessible names
  return htmlContent.replace(
    /<div([^>]*)role="link"([^>]*)>/g,
    (match, before, after) => {
      const hasAriaLabel = /aria-label|aria-labelledby/.test(before + after);
      if (hasAriaLabel) {
        return match;
      }
      // Add aria-label with a default accessible name
      return `<div${before}role="link" aria-label="Link"${after}>`;
    }
  );
};

const fixTableStructureIssues = () => {
  // ... implementation for REACT_027 ...
};

const addSvgAccessibleNames = () => {
  // ... implementation for REACT_041 ...
};

// Existing functions preserved:
// const newFunctionForTheIssue = () => { ... };

module.exports = {
  mainFunc,
  newFunc,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  addAriaLabelToMyDiv,
  // ... other exports if any ...
  newFunctionForTheIssue,
  addLangAttribute,
  // New functions added to address TODO at line 78
  dependencyGraphContent,
  indexContent
};