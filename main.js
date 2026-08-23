// TODO: This is the existing code that needs to be preserved
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
      /<html([ \t]*[^>]*)?>/i,
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
    const closingBracket = attrs ? attrs.indexOf('>') : -1;
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
      const theadMatch = /<thead[\s\S]*?<\/thead>/i.exec(content);
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
      if (!/<thead[\s\S]*?<\/thead>/i.test(content) || !/<tbody[\s\S]*?<\/tbody>/i.test(content)) {
        // Ensure proper closing tags
        if (!/<thead[\s\S]*?<\/thead>/i.test(content)) {
          result += `<thead></thead>`;
        }
        if (!/<tbody[\s\S]*?<\/tbody>/i.test(content)) {
          result += `<tbody></tbody>`;
        }
      }
      result += `</table>`;
      return result;
    } else if (!hasThead && hasTbody) {
      // No thead but has tbody - extract first row for thead if appropriate
      const tbodyMatch = /<tbody[\s\S]*?<\/tbody>/i.exec(content);
      if (tbodyMatch) {
        // Try to extract first row for thead
        const firstRowMatch = /<tr[\s\S]*?<\/tr>/i.exec(tbodyMatch[0]);
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
    const bodyMatch = /<body([^>]*)>([\s\S]*)<\/body>/i.exec(htmlContent);
    if (bodyMatch) {
      modifiedContent = modifiedContent.replace(
        /<body([^>]*)>([\s\S]*)<\/body>/i,
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
// This addresses REACT_025: React Unique Landmarks
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
    const firstChildMatch = /<svg([^>]*)>([\s\S]*)/i.exec(svgContent);
    if (firstChildMatch) {
      const content = firstChildMatch[2];
      const firstElementMatch = /<[a-zA-Z][^>]*>/i.exec(content);
      if (firstElementMatch && firstElementMatch.index !== undefined) {
        const titleElement = `<title>${accessibleName}</title>`;
        const insertPos = firstChildMatch.index + firstChildMatch[0].length - content.length;
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
    relAttr