// Function to get language attribute value
function getLangAttribute(lang) {
  if (!lang) return 'en';
  return lang;
}

// Function to get full language attribute with region
function getFullLangAttribute(lang, region) {
  if (!lang) return 'en';
  if (region) return `${lang}-${region}`;
  return lang;
}

// Add lang attribute to the root HTML element (HTML or BODY)
// This addresses REACT_015: Add lang attribute to HTML element
function addLangAttributeToHtml(htmlContent) {
  // Use default language 'en' if none provided
  const langValue = getLangAttribute('en');
  const fullLangValue = getFullLangAttribute('en', null);
  const langAttr = ` lang="${fullLangValue}"`;

  // If <html> tag exists, inject the lang attribute
  if (/<html\b/i.test(htmlContent)) {
    return htmlContent.replace(/<html\b/gi, `<html${langAttr}`);
  }
  // Otherwise prepend a wrapping <html> tag with the lang attribute
  return `<html${langAttr}>${htmlContent}</html>`;
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

// Wrap main tags function (now also injects lang attribute)
function wrapMainTags(htmlContent) {
  // Inject lang attribute into the root element first
  htmlContent = addLangAttributeToHtml(htmlContent);
  
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

// New function to fix 26 table structure issues
function fixTableStructureIssues(htmlContent) {
  return validateTableAccessibility(validateTableStructure(htmlContent));
}

// New function to ensure unique landmarks
function ensureUniqueLandmarks(htmlContent) {
  return validateLandmark(validateLandmarkStructure(htmlContent));
}

// Function to add accessible name to SVGs based on Insight Code REACT_041
function addAccessibleNameToSVGsForInsightCode(htmlContent) {
  // Regex to find SVG elements without an accessible name
  const svgRegex = /<svg[^>]*>([\s\S]*?)(?=<\/svg>)/gi;
  
  let modifiedContent = htmlContent;
  let match;
  
  // Loop through all SVG elements and add aria-label or title as accessible name
  while ((match = svgRegex.exec(modifiedContent)) !== null) {
    const svgContent = match[1];
    const accessibleName = 'Accessible SVG Content'; // Default accessible name
    
    // Check if SVG already has a title or aria-hidden
    if (!svgContent.includes('<title') && !svgContent.includes('aria-hidden="true"')) {
      modifiedContent = modifiedContent.replace(match[0], getSvgAccessibleName(match[0], accessibleName));
    }
  }
  
  return modifiedContent;
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
  createInPageButton,
  addAccessibleNameToSVGs,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  addAccessibleNameToSVGsForInsightCode // New export for the new function
};