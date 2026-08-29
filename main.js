import { dependencyGraphContent, indexContent } from './content';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 4 landmark issues (DONE: fixLandmarkIssues, addMainLandmark, addLandmarkRegions)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks, uniqueLandmarks)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames, addAccessibleNamesToSVGs)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue, fixFakeLinkIssues)
// - REACT_037: Google sign-in logic (DONE: googleSignIn)
// - REACT_040: Replace my-button with actual button id for accessibility (DONE: fixButtonIdentifiers)
// - REACT_042: Ensure dependencyGraph container has proper ARIA role (DONE: ensureDependencyGraphARIA)

/**
 * Adds lang attribute to HTML element for accessibility
 * @param {string} content - HTML content
 * @param {string} lang - Language code (default: 'en')
 * @returns {string} - Updated HTML content with lang attribute
 */
export function addLangAttribute(content, lang = 'en') {
  if (!content || typeof content !== 'string') return content;
  
  // Replace existing html tag or add lang attribute
  let updatedContent = content.replace(/<html[^>]*>/i, (match) => {
    if (match.includes('lang=')) {
      return match.replace(/lang=["'][^"']*["']/i, `lang="${lang}"`);
    }
    return match.replace('>', ` lang="${lang}">`);
  });
  
  // If no html tag found, add lang attribute to first tag
  if (!updatedContent.includes('lang=')) {
    updatedContent = updatedContent.replace(/<html([^>]*)>/i, `<html$1 lang="${lang}">`);
  }
  
  return updatedContent;
}

/**
 * Fixes table structure issues for accessibility
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with proper table structure
 */
export function fixTableStructure(content) {
  if (!content || typeof content !== 'string') return content;
  
  let updatedContent = content;
  
  // Add proper table headers (th) with scope attribute
  updatedContent = updatedContent.replace(/<th([^>]*)>(?!<)/gi, (match, attrs) => {
    if (!attrs.includes('scope=')) {
      return `<th${attrs} scope="col">`;
    }
    return match;
  });
  
  // Add caption elements where appropriate
  updatedContent = updatedContent.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (!match.includes('<caption') && !match.includes('role="presentation"')) {
      return `${match}\n  <caption>Table</caption>`;
    }
    return match;
  });
  
  // Add thead and tbody for proper table structure
  updatedContent = updatedContent.replace(
    /(<table[^>]*>)([^]*?)(<\/table>)/gi,
    (fullMatch, openTag, body, closeTag) => {
      if (body.includes('<thead') || body.includes('<tbody')) {
        return fullMatch;
      }
      
      let processedBody = body;
      
      // Wrap first row in thead if it looks like headers
      processedBody = processedBody.replace(
        /(<tr[^>]*>)([^]*?)(<\/tr>)/gi,
        (rowMatch, rowOpen, rowContent, rowClose) => {
          if (rowMatch.includes('<th') && !rowMatch.includes('<tbody') && !rowMatch.includes('<thead')) {
            return `<thead>\n  ${rowMatch}\n</thead>\n<tbody>`;
          }
          return rowMatch;
        }
      );
      
      // Wrap remaining rows in tbody
      if (!processedBody.includes('<tbody')) {
        processedBody = processedBody.replace(/(<tr)/gi, '<tbody>\n  $1');
        processedBody = processedBody.replace(/(<\/tr>)/gi, '$1\n</tbody>');
      }
      
      return `${openTag}\n${processedBody}\n${closeTag}`;
    }
  );
  
  return updatedContent;
}

/**
 * Main function to fix landmark issues
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with fixed landmarks
 */
export function fixLandmarkIssues(content) {
  if (!content || typeof content !== 'string') return content;
  
  let updatedContent = content;
  
  // Ensure main landmark exists
  updatedContent = addMainLandmark(updatedContent);
  
  // Add landmark regions
  updatedContent = addLandmarkRegions(updatedContent);
  
  // Ensure unique landmarks
  updatedContent = ensureUniqueLandmarks(updatedContent);
  
  return updatedContent;
}

/**
 * Adds main landmark to content
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with main landmark
 */
export function addMainLandmark(content) {
  if (!content || typeof content !== 'string') return content;
  
  // Check if main element already exists
  if (content.includes('<main') || content.includes('<main ')) {
    return content;
  }
  
  // Find body tag and wrap content with main
  let updatedContent = content.replace(/<body([^>]*)>/i, (match, attrs) => {
    return `${match}\n<main id="main-content" class="main-content">`;
  });
  
  // Close main tag before closing body
  updatedContent = updatedContent.replace(/<\/body>/i, '</main>\n</body>');
  
  return updatedContent;
}

/**
 * Adds landmark regions (header, nav, footer, etc.)
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with landmark regions
 */
export function addLandmarkRegions(content) {
  if (!content || typeof content !== 'string') return content;
  
  let updatedContent = content;
  
  // Ensure header landmark
  if (!updatedContent.includes('<header') && !updatedContent.includes('<header ')) {
    updatedContent = updatedContent.replace(/<body([^>]*)>/i, '<header role="banner">\n  $&');
  }
  
  // Ensure nav landmark
  if (!updatedContent.includes('<nav') && !updatedContent.includes('<nav ')) {
    // Find navigation elements and wrap with nav
    updatedContent = updatedContent.replace(
      /(<ul[^>]*class=["'][^"']*(?:menu|navigation|nav)[^"']*["'][^>]*>)/gi,
      '<nav role="navigation" aria-label="Main navigation">\n  $1'
    );
    updatedContent = updatedContent.replace(/(<\/ul>)/gi, '$1\n</nav>');
  }
  
  // Ensure footer landmark
  if (!updatedContent.includes('<footer') && !updatedContent.includes('<footer ')) {
    updatedContent = updatedContent.replace(/<\/body>/i, '<footer role="contentinfo">\n</footer>\n$&');
  }
  
  return updatedContent;
}

/**
 * Ensures all landmarks are unique
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with unique landmarks
 */
export function ensureUniqueLandmarks(content) {
  return uniqueLandmarks(content);
}

/**
 * Removes duplicate landmarks and ensures proper labeling
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with unique landmarks
 */
export function uniqueLandmarks(content) {
  if (!content || typeof content !== 'string') return content;
  
  let updatedContent = content;
  
  // Add aria-label to nav elements to distinguish them
  let navIndex = 0;
  updatedContent = updatedContent.replace(/<nav([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('aria-label=') && !attrs.includes('aria-labelledby=')) {
      navIndex++;
      const label = navIndex === 1 ? 'Main navigation' : `Navigation ${navIndex}`;
      return `<nav${attrs} aria-label="${label}">`;
    }
    return match;
  });
  
  // Add aria-label to aside elements
  let asideIndex = 0;
  updatedContent = updatedContent.replace(/<aside([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('aria-label=') && !attrs.includes('aria-labelledby=')) {
      asideIndex++;
      return `<aside${attrs} aria-label="Complementary content ${asideIndex}">`;
    }
    return match;
  });
  
  // Add id to main for skip links
  if (!updatedContent.includes('id="main-content"') && !updatedContent.includes("id='main-content'")) {
    updatedContent = updatedContent.replace(/<main([^>]*)>/i, '<main id="main-content"$1>');
  }
  
  return updatedContent;
}

/**
 * Adds accessible names to SVG elements
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with accessible SVG names
 */
export function addSvgAccessibleNames(content) {
  return addAccessibleNamesToSVGs(content);
}

/**
 * Adds accessible names to all SVG elements
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with accessible SVG names
 */
export function addAccessibleNamesToSVGs(content) {
  if (!content || typeof content !== 'string') return content;
  
  let updatedContent = content;
  
  // Add title to SVGs that don't have one
  updatedContent = updatedContent.replace(
    /<svg([^>]*)>(?!<title)/gi,
    (match, attrs) => {
      if (!attrs.includes('aria-label=') && !attrs.includes('aria-labelledby=')) {
        const id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
        return `<svg${attrs}>\n  <title id="${id}">SVG Image</title>`;
      }
      return match;
    }
  );
  
  // Add role="img" to SVGs
  updatedContent = updatedContent.replace(
    /<svg(?!\s+role=)([^>]*)>/gi,
    (match, attrs) => {
      if (!attrs.includes('role="img"')) {
        return `<svg role="img"${attrs}>`;
      }
      return match;
    }
  );
  
  // Connect title to SVG with aria-labelledby
  updatedContent = updatedContent.replace(
    /<svg([^>]*)>\s*<title[^>]*id="([^"]*)"[^>]*>/gi,
    '<svg$1} aria-labelledby="$2">'
  );
  
  return updatedContent;
}

/**
 * Fixes fake link issues (links that don't navigate)
 * @param {string} content - HTML content
 * @returns {string} - Updated HTML content with fixed fake links
 */
export function fixFakeLinkIssue(content) {
  return fixFakeLinkIssues(content);
}

/**
 * Fixes all fake link issues in the content
 * @param {string} content - HTML