Here is the resolved file content that integrates both changes:

```javascript
// ... existing code ...

// Accessibility utilities for React applications (from HEAD)
const accessibilityHelpers = {
  // Set document language attribute (REACT_015)
  setDocumentLanguage: (lang = 'en') => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  },

  // Validate table structure accessibility (REACT_027)
  validateTableStructure: (tableElement) => {
    if (!tableElement) return true;
    const hasCaption = tableElement.querySelector('caption');
    return !!hasCaption;
  },

  // Ensure SVG has accessible name (REACT_041)
  ensureSvgAccessibleName: (svgElement) => {
    if (!svgElement) return true;
    const hasAriaLabel = svgElement.hasAttribute('aria-label') ||
                         svgElement.hasAttribute('aria-labelledby') ||
                         svgElement.querySelector('title');
    return !!hasAriaLabel;
  },

  // Initialize accessibility features on app load (from HEAD)
  initAccessibility: () => {
    // Set default language
    this.setDocumentLanguage();

    // Add global styles for better accessibility (from HEAD)
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Focus indicators for keyboard navigation */
        :focus-visible {
          outline: 2px solid #005fcc;
          outline-offset: 2px;
        }

        /* Hide content visually but keep for screen readers */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `;
      document.head.appendChild(style);
    }
  }
};

// Helper functions (from origin/main)
function getLangAttribute(lang) {
  if (!lang) return 'en';
  return lang;
}

function getFullLangAttribute(lang, region) {
  if (!lang) return 'en';
  if (region) return `${lang}-${region}`;
  return lang;
}

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

// Validate table accessibility - adds scope attributes to table headers (from origin/main)
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

// Validate table structure - ensures tables have proper thead and tbody (from origin/main)
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

// ... other functions from origin/main ...

// Wrap main tags function (now also injects lang attribute)
function wrapMainTags(htmlContent) {
  const startingMain = /<main/i.test(htmlContent);
  const endingMain = /<\/main>/i.test(htmlContent);

  if (startingMain && endingMain) {
    const wrappedContent = addLangAttribute(htmlContent);
    return wrappedContent;
  } else if (!startingMain) {
    const LangAttributeValue = getLangAttribute();
    const basicMain = `<main lang="${LangAttributeValue}">`;
    let botContent = `<!(-- Generated by Screeps bot --)>`;
    botContent += `<style>/* Screeps UI styles go here */</style>`;
    botContent += `<div id="game" class="game"></div>`;

    const wrappedContent = botContent + basicMain;
    return wrappedContent;
  }
}

// Preserving existing main.js structure and content
module.exports = {
  ...dashboardComponents,
  accessibilityHelpers,
  wrapMainTags
};
```

This combined version retains all changes from both branches, aiding accessibility and addressing both REACT_xxx and Screeps bot functionality in a single file.