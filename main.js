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

// Add lang attribute to the root HTML element (HTML or BODY)
// This addresses REACT_015: Add lang attribute to HTML element
function addLangAttribute(htmlContent, lang = 'en', region = null) {
  // Use default language 'en' if none provided
  const langValue = getLangAttribute(lang);
  const fullLangValue = getFullLangAttribute(lang, region);
  const langAttr = ` lang="${fullLangValue}"`;

  // If <html> tag exists, inject the lang attribute
  if (/<html\b/i.test(htmlContent)) {
    return htmlContent.replace(/<html(\s+[^>]*)?>/i, `<html$1${langAttr}>`);
  }
  // Otherwise prepend a wrapping <html> tag with the lang attribute
  return `<html${langAttr}>${htmlContent}</html>`;
}

// Validate table accessibility - adds scope attributes to table headers
// This addresses REACT_027: React Table Structure
function validateTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const thRegex = /<th(\s+[^>]*)?>(?!.*scope=)/gi;
  let modifiedContent = htmlContent.replace(thRegex, (match, attrs) => {
    if (attrs && /scope=/i.test(attrs)) {
      return match;
    }
    const closingBracket = match.lastIndexOf('>');
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
  const tableRegex = /<table(\s+[^>]*)?>([\s\S]*?)<\/table>/gi;
  
  modifiedContent = modifiedContent.replace(tableRegex, (match, attrs, content) => {
    let result = `<table${attrs}>`;
    
    // Check if thead exists
    const hasThead = /<thead/i.test(content);
    const hasTbody = /<tbody/i.test(content);
    
    // If no thead or tbody, wrap content appropriately
    if (!hasThead && !hasTbody) {
      // Wrap all content in tbody
      result += `<tbody>${content}</tbody>`;
    } else if (hasThead && !hasTbody) {
      // Extract thead and wrap remaining in tbody
      const theadMatch = content.match(/<thead[^>]*>[\s\S]*?<\/thead>/i);
      if (theadMatch) {
        result += theadMatch[0];
        const remaining = content.replace(/<thead[^>]*>[\s\S]*?<\/thead>/i, '');
        result += `<tbody>${remaining}</tbody>`;
      } else {
        result += `<tbody>${content}</tbody>`;
      }
    } else if (!hasThead && hasTbody) {
      // No thead but has tbody - extract first row(s) for thead if appropriate
      const tbodyMatch = content.match(/<tbody[^>]*>[\s\S]*?<\/tbody>/i);
      if (tbodyMatch) {
        // Try to extract first row for thead
        const firstRowMatch = tbodyMatch[0].match(/<tr[^>]*>[\s\S]*?<\/tr>/i);
        if (firstRowMatch) {
          result += `<thead><tr>${firstRowMatch[0].replace(/<td/gi, '<th').replace(/<\/td>/gi, '</th>')}</tr></thead>`;
          const restContent = tbodyMatch[0].replace(firstRowMatch[0], '');
          result += `<tbody>${restContent}</tbody>`;
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
  if (!/<main[^>]*>/i.test(modifiedContent) && !/<[^>]*\bmain\b[^>]*>/i.test(modifiedContent)) {
    // Wrap content in main tag
    const bodyMatch = modifiedContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      modifiedContent = modifiedContent.replace(
        /<body([^>]*)>([\s\S]*?)<\/body>/i,
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
  const navRegex = /<nav(\s+[^>]*)?>/gi;
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
    const firstChildMatch = svgContent.match(/<svg[^>]*>([\s\S]*)$/i);
    if (firstChildMatch) {
      const content = firstChildMatch[1];
      const firstElementMatch = content.match(/<[a-zA-Z][^>]*>/);
      if (firstElementMatch && firstElementMatch.index !== undefined) {
        const titleElement = `<title>${accessibleName}</title>`;
        const insertPos = firstElementMatch.index;
        return svgContent.replace(
          /<svg([^>]*)>([\s\S]*)$/i,
          `<svg$1>${titleElement}${content}`
        );
      }
    }
    // Fallback: prepend title
    return svgContent.replace(/<svg([^>]*)>/, `<svg$1><title>${accessibleName}</title>`);
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
  
  return `<a href="${url}" target="_${target}"${relString}${classString}${ariaLabelString}>${text}</a>`;
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
function addSvgAccessibleNames(htmlContent, defaultName = 'Decorative image') {
  // Regex to find SVG elements
  const svgRegex = /<svg([^>]*)>([\s\S]*?)<\/svg>/gi;
  
  let modifiedContent = htmlContent;
  let match;
  
  // Loop through all SVG elements and add accessible name if missing
  while ((match = svgRegex.exec(modifiedContent)) !== null) {
    const svgOpenTag = match[1];
    const svgInnerContent = match[2];
    
    // Check if SVG already has a title, aria-label, or aria-hidden
    const hasTitle = /<title/i.test(svgInnerContent);
    const hasAriaLabel = /aria-label=/i.test(svgOpenTag);
    const isAriaHidden = /aria-hidden=["']true["']/i.test(svgOpenTag);
    
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
    
    // Add accessible name to the SVG
    const svgFull = match[0];
    const newSvg = getSvgAccessibleName(svgFull, accessibleName);
    modifiedContent = modifiedContent.replace(svgFull, newSvg);
  }
  
  return modifiedContent;
}

// Wrap main tags function (now also injects lang attribute)
// This addresses