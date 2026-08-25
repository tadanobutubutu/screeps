/**
 * Accessibility fixes for main.js
 * Addresses issues from insight report:
 * - REACT_015: Add lang attribute to HTML element
 * - REACT_027: Fix 26 table structure issues
 * - REACT_017: Add/fix 2 landmark issues
 * - REACT_041: Add accessible names to 2 SVGs
 * - REACT_025: Ensure unique landmarks
 * - REACT_036: Fix 1 fake link issue
 */

// Add lang attribute to HTML element
function addLangAttribute(htmlContent, lang = 'en') {
  const langRegex = /<html([^>]*)>/i;
  const match = htmlContent.match(langRegex);
  
  if (match) {
    const attributes = match[1];
    if (!attributes.includes('lang=')) {
      return htmlContent.replace(langRegex, `<html$1 lang="${lang}">`);
    }
  }
  return htmlContent.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
}

// Add main landmark to HTML content
function addMainLandmark(htmlContent) {
  // Check if main element already exists
  if (htmlContent.includes('<main') || htmlContent.includes('<main>')) {
    return htmlContent;
  }
  
  // Try to find body tag and wrap content with main
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const wrappedContent = bodyContent.replace(
      /(<body[^>]*>)[\s\S]*(<\/body>)/i,
      '$1<main>' + bodyContent + '</main>$2'
    );
    return htmlContent.replace(/<body[^>]*>[\s\S]*<\/body>/i, wrappedContent);
  }
  
  return htmlContent;
}

// Add accessible names to SVGs
function addSvgAccessibleNames(htmlContent, svgNames = {}) {
  let result = htmlContent;
  
  // Find all SVG elements
  const svgRegex = /<svg([^>]*)>([\s\S]*?)<\/svg>/gi;
  
  result = result.replace(svgRegex, (match, attrs, innerContent) => {
    // Check if title already exists
    if (innerContent.includes('<title')) {
      return match;
    }
    
    // Check for id to use as accessible name
    const idMatch = attrs.match(/id=["']([^"']+)["']/);
    const id = idMatch ? idMatch[1] : null;
    const name = svgNames[id] || svgNames.default || 'Decorative SVG';
    
    // Add title as first child for accessibility
    return `<svg${attrs}><title>${name}</title>${innerContent}</svg>`;
  });
  
  return result;
}

// Fix table structure issues
function fixTableStructureIssues(htmlContent) {
  let result = htmlContent;
  
  // Find all table elements
  const tableRegex = /<table([^>]*)>([\s\S]*?)<\/table>/gi;
  
  result = result.replace(tableRegex, (match, attrs, tableContent) => {
    let fixedContent = tableContent;
    
    // Check if thead doesn't exist but has tr > th pattern
    if (!fixedContent.includes('<thead') && fixedContent.match(/<tr[^>]*>[\s\S]*?<th[^>]*>/i)) {
      // Extract first row with th elements
      const firstRowMatch = fixedContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/i);
      if (firstRowMatch) {
        const headerRow = firstRowMatch[0];
        const headerCells = headerRow.replace(/<th/g, '<th scope="col"').replace(/<th scope="col"/g, (m) => m);
        
        // Remove first row from content
        fixedContent = fixedContent.replace(/<tr[^>]*>[\s\S]*?<\/tr>/i, '');
        
        // Add thead with header row
        fixedContent = `<thead>${headerCells.replace(/<th/g, '<th scope="col"')}</thead><tbody>${fixedContent.trim()}</tbody>`;
      }
    } else if (fixedContent.includes('<thead') && !fixedContent.includes('<tbody')) {
      // Add tbody after thead
      fixedContent = fixedContent.replace(/<\/thead>/, '</thead><tbody>') + '</tbody>';
    }
    
    return `<table${attrs}>${fixedContent}</table>`;
  });
  
  return result;
}

// Ensure unique landmarks
function ensureUniqueLandmarks(htmlContent) {
  let result = htmlContent;
  const landmarkCounts = {};
  
  // Common landmark elements
  const landmarks = ['header', 'nav', 'main', 'aside', 'footer'];
  
  landmarks.forEach(landmark => {
    const regex = new RegExp(`<${landmark}([^>]*)>`, 'gi');
    let count = 0;
    
    result = result.replace(regex, (match, attrs) => {
      count++;
      if (!attrs.includes('aria-label') && !attrs.includes('id=')) {
        const uniqueId = `${landmark}-${count}`;
        return `<${landmark} id="${uniqueId}"${attrs}>`;
      }
      return match;
    });
    
    landmarkCounts[landmark] = count;
  });
  
  return result;
}

// Fix fake link issues (elements that look like links but aren't)
function fixFakeLinkIssues(htmlContent) {
  let result = htmlContent;
  
  // Find divs or spans with href attribute (fake links)
  const fakeLinkRegex = /<(div|span|p)([^>]*)\bhref=["']([^"']+)["']([^>]*)>/gi;
  
  result = result.replace(fakeLinkRegex, (match, tag, before, href, after) => {
    // Convert to anchor element
    return `<a href="${href}"${before}${after}>`;
  });
  
  // Also fix closing tags
  result = result.replace(/<\/(div|span|p)([^>]*)>\s*(?=<\/?(?:div|span|p)([^>]*)\bhref=)/gi, '</a>');
  
  return result;
}

// Export all functions
module.exports = {
  addLangAttribute,
  addMainLandmark,
  addSvgAccessibleNames,
  fixTableStructureIssues,
  ensureUniqueLandmarks,
  fixFakeLinkIssues
};