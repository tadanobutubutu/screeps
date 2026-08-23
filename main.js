// main.js

/**
 * Adds <main> landmark to HTML content for accessibility (REACT_017)
 * @param {string} htmlContent - The HTML content to process
 * @returns {string} - HTML content with <main> landmark added
 */
function addMainLandmark(htmlContent) {
    // Check if <main> already exists
    if (htmlContent.includes('<main>')) {
        return htmlContent;
    }

    // Wrap primary content in <main> landmark
    // Pattern 1: Container div with Quality & Metrics content
    let updated = htmlContent.replace(
        /(<div class="container">[\s\S]*?<\/div>\s*)<\/body>/i,
        '<main>$1</main></body>'
    );

    // Pattern 2: Table rotated content
    if (updated === htmlContent) {
        updated = htmlContent.replace(
            /(<table id="table-rotated">[\s\S]*?<\/table>\s*)<\/body>/i,
            '<main>$1</main></body>'
        );
    }

    return updated;
}

// Helper function to get language attribute value
function getLangAttribute(lang) {
  if (!lang) return 'en';
  return lang;
}

// Helper function to get full language attribute with region
function getFullLangAttribute(lang, region) {
  if (!lang) return 'en';
  if (region) return `${lang}-${region}`;
  return lang;
}

// Validate table accessibility
function validateTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const thRegex = /<th(?![^>]*\bscope\b)[^>]*>/gi;
  let modifiedContent = htmlContent.replace(thRegex, (match) => {
    return match.replace('>', ' scope="col">');
  });
  return modifiedContent;
}

// Validate table structure
function validateTableStructure(htmlContent) {
  // Ensure tables have proper structure with thead and tbody
  let modifiedContent = htmlContent;
  
  // Add thead/tbody if missing
  const tableRegex = /<table([^>]*)>([\s\S]*?)(?:<thead([\s\S]*?)<\/thead>)?([\s\S]*?)(?:<tbody([\s\S]*?)<\/tbody>)?([\s\S]*?)<\/table>/gi;
  modifiedContent = htmlContent.replace(tableRegex, (match, attrs, before, thead, tbody, tbody2, after) => {
    let result = `<table${attrs}>`;
    
    if (thead) {
      result += `<thead${thead}</thead>`;
    }
    
    if (tbody || tbody2) {
      result += `<tbody${tbody || tbody2}</tbody>`;
    } else if (!thead) {
      // Wrap content in tbody if no thead
      const content = before + (tbody2 || '');
      result += `<tbody>${content}</tbody>`;
    }
    
    result += `</table>`;
    return result;
  });
  
  return modifiedContent;
}

// Validate landmark elements
function validateLandmark(htmlContent) {
  let modifiedContent = htmlContent;
  
  // Add main landmark if not present
  if (!/<main[\s>]/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/<body([^>]*)>/i, '<main$1>');
  }
  
  return modifiedContent;
}

// Validate landmark structure
function validateLandmarkStructure(htmlContent) {
  // Ensure proper landmark nesting and structure
  let modifiedContent = htmlContent;
  
  // Add header/footer nav landmarks if missing
  if (!/<header/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/<body([^>]*)>/i, '<header role="banner"><nav role="navigation"></nav></header><main$1>');
  }
  
  if (!/<footer/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/<\/body>/i, '</main><footer role="contentinfo"></footer></body>');
  }
  
  return modifiedContent;
}

// Get SVG accessible name
function getSvgAccessibleName(svgContent, accessibleName) {
  if (!accessibleName) return svgContent;
  
  // Add title element to SVG for accessibility
  if (!svgContent.includes('<title')) {
    return svgContent.replace('<svg', `<svg><title>${accessibleName}</title>`);
  }
  
  return svgContent;
}

// Create accessible link
function createAccessibleLink(url, text, options = {}) {
  const { className = '', target = '_self', rel = '' } = options;
  
  const relAttr = rel || (target === '_blank' ? 'noopener noreferrer' : '');
  
  return `<a href="${url}" target="_${target}"${relAttr ? ` rel="${relAttr}"` : ''}${className ? ` class="${className}"` : ''}>${text}</a>`;
}

// Create in-page button
function createInPageButton(text, options = {}) {
  const { className = '', id = '', ariaLabel = '' } = options;
  
  const idAttr = id ? ` id="${id}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  
  return `<button type="button"${idAttr}${classAttr}${ariaAttr}>${text}</button>`;
}

// Function to add accessible name to SVG elements
function addAccessibleNameToSVGs(htmlContent) {
  // Regex to find SVG elements without an accessible name
  const svgRegex = /<svg[^>]*>([\s\S]*?)(?=<\/svg>)/gi;
  
  let modifiedContent = htmlContent;
  let match;
  
  // Loop through all SVG elements and add aria-label or title as accessible name
  while ((match = svgRegex.exec(modifiedContent)) !== null) {
    const svgContent = match[1];
    const accessibleName = 'SVG Content'; // Default accessible name
    
    // Check if SVG already has a title or aria-hidden
    if (!svgContent.includes('<title') && !svgContent.includes('aria-hidden="true"')) {
      modifiedContent = modifiedContent.replace(match[0], getSvgAccessibleName(match[0], accessibleName));
    }
  }
  
  return modifiedContent;
}

// Wrap main tags function
function wrapMainTags(htmlContent) {
  // Check if the HTML content already has <main> tag
  const isMainTagExists = /<main[\s>]/i.test(htmlContent);

  if (!isMainTagExists) {
    // Wrap the content inside a <main> tag
    const container = htmlContent;
    const modifiedContent = `<main>${container}</main>`;
    return modifiedContent;
  }

  return htmlContent;
}

// Export for use by other modules
module.exports = {
  addMainLandmark,
  // ... existing exports ...
  wrapMainTags,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
  createInPageButton,
  addAccessibleNameToSVGs // New export
};
};