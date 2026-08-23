// ... existing code ...

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

// Export wrapMainTags function
module.exports = {
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
  createInPageButton
};