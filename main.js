// ... existing code ...

// Import content modules for dependency graphs and index views
import { dependencyGraphContent } from './dependencyGraph.js';
import { indexContent } from './index.js';

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

// Add lang attribute to the root HTML element (HTML or BODY)
// This addresses REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlContent, lang = 'en', region = null) {
  // Use default language 'en' if none provided
  const langValue = getLangAttribute(lang);
  const fullLangValue = getFullLangAttribute(lang, region);
  const langAttr = ` lang="${fullLangValue}"`;

  // If <html> tag exists, inject the lang attribute
  if (/<html\b/i.test(htmlContent)) {
    return htmlContent.replace(
      /<html(\s[^>]*)?>/i,
      (match, attrs) => {
        if (attrs && /lang\s*=/i.test(attrs)) {
          return match;
        }
        return `<html${attrs || ''}${langAttr}>`;
      }
    );
  }
  // Otherwise prepend a wrapping <html> tag with the lang attribute
  return `<html${langAttr}>${htmlContent}</html>`;
}

// Validate table accessibility - adds scope attributes to table headers
// This addresses REACT_027: React Table Structure
function validateTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const thRegex = /<th(\s[^>]*)?>/gi;
  let modifiedContent = htmlContent.replace(thRegex, (match, attrs) => {
    if (attrs && /scope=/i.test(attrs)) {
      return match;
    }
    const closingBracket = attrs ? attrs.lastIndexOf('>') : -1;
    if (closingBracket !== -1) {
      return match.substring(0, closingBracket) + ' scope="col">';
    }
    return match.replace('>', ' scope="col">');
  });
  return modifiedContent;
}

// Validate table structure - ensures tables have proper thead and tbody
// This addresses REACT_027: React Table Structure
function validateTableStructure(htmlContent) {
  // Ensure tables have proper structure with thead and tbody
  let modifiedContent = htmlContent;

  // Pattern to match table elements that need structure
  const tableRegex = /<table(\s[^>]*)?>([\s\S]*?)<\/table>/gi;

  modifiedContent = modifiedContent.replace(tableRegex, (match, attrs, content) => {
    let result = `<table${attrs || ''}>`;

    // Check if thead exists
    const hasThead = /<thead/i.test(content);
    const hasTbody = /<tbody/i.test(content);

    // If no thead or tbody, wrap content appropriately
    if (!hasThead && !hasTbody) {
      // Wrap all content in tbody
      result += `<tbody>${content}</tbody>`;
    } else if (hasThead && !hasTbody) {
      // Extract thead and wrap remaining in tbody
      const theadMatch = content.match(/<thead[\s\S]*?<\/thead>/i);
      if (theadMatch) {
        result += theadMatch[0];
        const remaining = content.replace(theadMatch[0], '');
        result += `<tbody>${remaining}</tbody>`;
      } else {
        result += `<tbody>${content}</tbody>`;
      }
    } else if (hasThead && hasTbody) {
      // If both thead and tbody exist, ensure they are properly closed
      // and add any missing structure
      if (!/<\/thead>/i.test(content) || !/<\/tbody>/i.test(content)) {
        // Ensure proper closing tags
        if (!/<\/thead>/i.test(content)) {
          result += `<thead></thead>`;
        }
        if (!/<\/tbody>/i.test(content)) {
          result += `<tbody></tbody>`;
        }
      }
      result += `</table>`;
      return result;
    } else if (!hasThead && hasTbody) {
      // No thead but has tbody - extract first row for thead if appropriate
      const tbodyMatch = content.match(/<tbody[\s\S]*?<\/tbody>/i);
      if (tbodyMatch) {
        // Try to extract first row for thead
        const firstRowMatch = tbodyMatch[0].match(/<tr[\s\S]*?<\/tr>/i);
        if (firstRowMatch) {
          result += `<thead><tr>${firstRowMatch[0].replace(/<td/gi, '<th').replace(/<\/td>/gi, '</th>')}</tr></thead>`;
          const restContent = tbodyMatch[0].replace(firstRowMatch[0], '');
          result += restContent;
        } else {
          result += content;
        }
      } else {
        result += content;
      }
    } else {
      result += content;
    }

    result += `</table>`;
    return result;
  });

  return modifiedContent;
}

// Validate landmark elements - ensures proper landmark structure
// This addresses REACT_017: React Landmarks
function validateLandmark(htmlContent) {
  let modifiedContent = htmlContent;

  // Add main landmark if not present
  if (!/<main/i.test(htmlContent)) {
    // Wrap content in main tag
    const bodyMatch = htmlContent.match(/<body(\s[^>]*)?>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      modifiedContent = modifiedContent.replace(
        /<body$1>([\s\S]*)<\/body>/i,
        '<body$1><main>$2</main></body>'
      );
    } else {
      // If no body tag, wrap everything in main
      modifiedContent = `<main>${modifiedContent}</main>`;
    }
  }

  return modifiedContent;
}

// Validate landmark structure - ensures proper landmark nesting and structure
// This addresses REACT_025: React Unique Landmarks and REACT_017: React Landmarks
function validateLandmarkStructure(htmlContent) {
  // Ensure proper landmark nesting and structure
  let modifiedContent = htmlContent;

  // Add header landmark if missing
  if (!/<header/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(
      /(<body[^>]*>)/i,
      '$1<header role="banner"><nav aria-label="Main navigation"></nav></header>'
    );
  }

  // Add footer landmark if missing
  if (!/<footer/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(
      /(<\/body>)/i,
      '<footer role="contentinfo"></footer>$1'
    );
  }

  // Ensure nav has proper aria-label for uniqueness
  const navRegex = /<nav(\s[^>]*)?>/gi;
  let navCount = 0;
  modifiedContent = modifiedContent.replace(navRegex, (match, attrs) => {
    navCount++;
    if (attrs && /aria-label=/i.test(attrs)) {
      return match;
    }
    if (navCount === 1) {
      return match.replace('>', ' aria-label="Main navigation">');
    } else {
      return match.replace('>', ` aria-label="Secondary navigation ${navCount}">`);
    }
  });

  return modifiedContent;
}

// Get SVG accessible name - ensures SVG elements have accessible names
// This addresses REACT_041: React SVG Accessible Name
function getSvgAccessibleName(svgContent, accessibleName) {
  if (!accessibleName) return svgContent;

  // Add title element to SVG for accessibility
  if (!/<title/i.test(svgContent)) {
    // Find the first child element position
    const firstChildMatch = svgContent.match(/(<svg[^>]*>)(\s*)/i);
    if (firstChildMatch) {
      const content = firstChildMatch[2];
      const firstElementMatch = content.match(/<[a-zA-Z]/);
      if (firstElementMatch && firstElementMatch.index !== undefined) {
        const titleElement = `<title>${accessibleName}</title>`;
        const insertPos = firstChildMatch[0].length;
        return svgContent.substring(0, insertPos) + titleElement + svgContent.substring(insertPos);
      }
    }
    // Fallback: prepend title
    return svgContent.replace(/(<svg[^>]*>)/i, `$1<title>${accessibleName}</title>`);
  }

  return svgContent;
}

// Create accessible link - ensures links have proper attributes
// This addresses REACT_036: React Fake Link
function createAccessibleLink(url, text, options = {}) {
  const { className = '', target = '_self', rel = '', ariaLabel = '' } = options;

  let relAttr = rel;
  if (!relAttr && target === '_blank') {
    relAttr = 'noopener noreferrer';
  }

  const relString = relAttr ? ` rel="${relAttr}"` : '';
  const classString = className ? ` class="${className}"` : '';
  const ariaLabelString = ariaLabel ? ` aria-label="${ariaLabel}"` : '';

  return `<a href="${url}"${classString}${ariaLabelString} target="${target}"${relString}>${text}</a>`;
}

// Create in-page button
function createInPageButton(text, options = {}) {
  const { className = '', id = '', ariaLabel = '', type = 'button', disabled = false } = options;

  const idAttr = id ? ` id="${id}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';
  const disabledAttr = disabled ? ' disabled' : '';

  return `<button${idAttr}${classAttr}${ariaAttr} type="${type}"${disabledAttr}>${text}</button>`;
}

// Function to add accessible name to SVG elements
// This addresses REACT_041: React SVG Accessible Name
function addSvgAccessibleName(htmlContent, defaultName = 'Decorative image') {
  // Regex to find SVG elements
  const svgRegex = /<svg(\s[^>]*)?>([\s\S]*?)<\/svg>/gi;

  let modifiedContent = htmlContent;
  let match;

  // Collect all matches first to avoid issues with modifying content during iteration
  const matches = [];
  while ((match = svgRegex.exec(htmlContent)) !== null) {
    matches.push({
      fullMatch: match[0],
      openTag: match[1],
      content: match[2],
      index: match.index,
      endIndex: match.index + match[0].length
    });
  }

  // Process matches in reverse order to preserve indices when replacing
  for (let i = matches.length - 1; i >= 0; i--) {
    const m = matches[i];
    const svgOpenTag = m.openTag || '';
    const svgInnerContent = m.content;

    // Check if SVG already has a title, aria-label, or aria-hidden
    const hasTitle = /<title/i.test(svgInnerContent);
    const hasAriaLabel = /aria-label=/i.test(svgOpenTag);
    const isAriaHidden = /aria-hidden\s*=\s*["']true["']/i.test(svgOpenTag);

    // If SVG is hidden from screen readers, skip it
    if (isAriaHidden) {
      continue;
    }

    // If SVG already has accessible name, skip it
    if (hasTitle || hasAriaLabel) {
      continue;
    }

    // Get accessible name from title if it exists
    let accessibleName = defaultName;
    const titleMatch = svgInnerContent.match(/<title[^>]*>([^<]*)<\/title>/i);
    if (titleMatch) {
      accessibleName = titleMatch[1].trim();
    }

    // If accessible name is empty, use defaultName
    if (!accessibleName) {
      const firstElementMatch = svgInnerContent.match(/<[a-zA-Z]/);
      if (firstElementMatch) {
        const elementName = firstElementMatch[0].toLowerCase();
        accessibleName = capitalizeFirstLetter(elementName) + ' Image';
      }
    }

    // Add accessible name using title element
    const titleElement = `<title>${accessibleName}</title>`;
    const closingBracketIndex = svgOpenTag.indexOf('>');
    const newSvg = `<svg${svgOpenTag.substring(0, closingBracketIndex)}>${titleElement}${svgInnerContent}</svg>`;
    
    modifiedContent = modifiedContent.substring(0, m.index) + newSvg + modifiedContent.substring(m.endIndex);
  }

  return modifiedContent;
}

// Helper function to capitalize first letter of a string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Missing function - getPascalCaseFromCamelCase
// This function converts camelCase to PascalCase
function getPascalCaseFromCamelCase(str) {
  return str.replace(/(?:^\w|(?<\w)\w)/g, function (match) {
    return match.toUpperCase();
  });
}

// Wrap primary content in main tag
// This function implements the wrapPrimaryContentInMain functionality
function wrapPrimaryContentInMain(htmlContent) {
  // Find the main landmark if it exists
  const mainMatch = htmlContent.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) {
    // Extract content between main tags
    const mainContent = mainMatch[1];
    // Wrap the entire content in a main tag
    return `<main>${mainContent}</main>`;
  }
  // If no main tag found, try to find primary content after the main landmark
  // or before the footer
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    // Wrap the body content in a main tag
    return `<main>${bodyContent}</main>`;
  }
  // Fallback: wrap everything in main
  return `<main>${htmlContent}</main>`;
}

// Main function to process HTML content and address accessibility issues
// This function integrates all accessibility fixes
function processAccessibilityIssues(htmlContent) {
  let processedContent = htmlContent;
  
  // Apply REACT_015: Add lang attribute to HTML element
  processedContent = addLangAttribute(processedContent);
  
  // Apply REACT_017: Add/fix landmark issues
  processedContent = validateLandmark(processedContent);
  processedContent = validateLandmarkStructure(processedContent);
  
  // Apply REACT_041: Add accessible names to SVGs
  processedContent = addSvgAccessibleName(processedContent);
  
  // Apply table accessibility improvements
  processedContent = validateTableAccessibility(processedContent);
  processedContent = validateTableStructure(processedContent);
  
  return processedContent;
}

// Function to address accessibility issues based on an insight report
// This function selectively applies fixes according to reported issues
function addressAccessibilityIssues(htmlContent, insightReport) {
  let processedContent = htmlContent;

  if (insightReport.includes('REACT_015')) {
    processedContent = addLangAttribute(processedContent);
  }
  if (insightReport.includes('REACT_017')) {
    processedContent = validateLandmark(processedContent);
    processedContent = validateLandmarkStructure(processedContent);
  }
  if (insightReport.includes('REACT_041')) {
    processedContent = addSvgAccessibleName(processedContent);
  }
  if (insightReport.includes('REACT_027')) {
    processedContent = validateTableAccessibility(processedContent);
    processedContent = validateTableStructure(processedContent);
  }

  return processedContent;
}

// TODO: Add any other missing exports that might have been?
function anotherExport() {
  // Add any necessary implementation here
}

// Export functions for use in other modules
export {
  getLangAttribute,
  getFullLangAttribute,
  addLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
  createInPageButton,
  addSvgAccessibleName,
  capitalizeFirstLetter,
  getPascalCaseFromCamelCase,
  wrapPrimaryContentInMain,
  processAccessibilityIssues,
  addressAccessibilityIssues,
  anotherExport
};

// ... existing code ...