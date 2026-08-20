// main.js - Helper utilities for accessibility fixes

/**
 * Checks if the given JSX/TSX content has a <main> landmark
 * @param {string} content - File content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  const mainRegex = /<main[\s>]/gi;
  return mainRegex.test(content);
}

/**
 * Wraps children in a <main> landmark
 * @param {string} content - File content to modify
 * @param {string} childrenTag - The tag containing main children (e.g., 'body', 'div')
 * @returns {string} - Modified content with <main> landmark
 */
function addMainLandmark(content, childrenTag = 'children') {
  // Pattern to find <body>{children}</body> or <div>{children}</div>
  const bodyPattern = /<(\w+)>\s*\{(\w+)\}\s*<\/\1>/g;
  
  return content.replace(bodyPattern, (match, tag, children) => {
    if (tag === 'body' || tag === 'div' || tag === 'section') {
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
}

/**
 * Escapes HTML entities in a string
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHtml(str) {
  const htmlEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

/**
 * Finds and returns the positions of main landmarks in content
 * @param {string} content - File content to search
 * @returns {Array<{start: number, end: number, tag: string}>} - Array of main landmark positions
 */
function findMainLandmarks(content) {
  const results = [];
  const regex = /<main[^>]*>[\s\S]*?<\/main>/gi;
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    results.push({
      start: match.index,
      end: match.index + match[0].length,
      tag: match[0]
    });
  }
  
  return results;
}

/**
 * Wraps the primary content area in a <main> landmark for React/JSX files
 * @param {string} content - File content to modify
 * @returns {string} - Modified content with <main> landmark added
 */
function wrapMainContent(content) {
  // Pattern for <body>{children}</body> or similar single child patterns
  const singleChildPattern = /<(\w+)(?:\s+[^>]*)?>\s*\{(\w+)\}\s*<\/\1>/g;
  
  let result = content;
  let modified = false;
  
  // First, try to wrap single child patterns (body, div, section with only {children})
  result = result.replace(singleChildPattern, (match, tag, children) => {
    if (!modified && (tag === 'body' || tag === 'div' || tag === 'section')) {
      modified = true;
      return `<${tag}>\n    <main>\n        {${children}}\n    </main>\n</${tag}>`;
    }
    return match;
  });
  
  // If no single child pattern found, try to find and wrap the main content area
  if (!hasMainLandmark(result)) {
    // Pattern for content after <html> or <body> opening tags
    const bodyContentPattern = /<(?:body|div)(?:\s[^>]*)?>([\s\S]*?)(<\/(?:body|div)>)/gi;
    result = result.replace(bodyContentPattern, (match, innerContent, closingTag) => {
      if (!hasMainLandmark(match)) {
        const indent = innerContent.match(/^(\s*)/)[1] || '    ';
        return `<${closingTag.slice(2, -1)}>\n${indent}<main>\n${innerContent}\n${indent}</main>\n${indent}${closingTag}`;
      }
      return match;
    });
  }
  
  return result;
}

/**
 * Validates if a file needs a main landmark
 * @param {string} content - File content to check
 * @param {string} filename - Name of the file being checked
 * @returns {boolean} - True if main landmark is needed
 */
function needsMainLandmark(content, filename) {
  // Skip files that already have main landmark
  if (hasMainLandmark(content)) {
    return false;
  }
  
  // Only check relevant file types
  const relevantExtensions = ['.tsx', '.ts', '.jsx', '.js', '.html'];
  const isRelevant = relevantExtensions.some(ext => filename.endsWith(ext));
  
  if (!isRelevant) {
    return false;
  }
  
  // Check if the file has meaningful content (not just imports/exports)
  const hasContent = content.includes('{') && content.includes('}');
  const hasBodyOrDiv = /<(body|div)[\s>]/i.test(content);
  
  return hasContent && hasBodyOrDiv;
}

/**
 * Gets the suggested main landmark wrapper for a file
 * @param {string} content - File content to analyze
 * @param {string} filename - Name of the file
 * @returns {string} - Suggested main landmark code
 */
function getSuggestedMainLandmark(content, filename) {
  const fileExt = filename.split('.').pop();
  
  // For HTML files
  if (fileExt === 'html') {
    const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      return `<main>\n    ${bodyMatch[1].trim()}\n</main>`;
    }
  }
  
  // For JSX/TSX files
  if (['tsx', 'jsx'].includes(fileExt)) {
    const childMatch = content.match(/<(\w+)>\s*\{(\w+)\}\s*<\/\1>/);
    if (childMatch) {
      const tag = childMatch[1];
      return `<${tag}>\n    <main>\n        {${childMatch[2]}}\n    </main>\n</${tag}>`;
    }
    
    // Try to find main content container
    const divMatch = content.match(/<div[^>]*class=["']([^"']*)["'][^>]*>[\s\S]*?<\/div>/i);
    if (divMatch) {
      return `<main>\n    <div class="${divMatch[1]}">...</div>\n</main>`;
    }
  }
  
  return '<main>\n    <!-- main content -->\n</main>';
}

// Export utilities for testing
module.exports = {
  hasMainLandmark,
  addMainLandmark,
  escapeHtml,
  findMainLandmarks,
  wrapMainContent,
  needsMainLandmark,
  getSuggestedMainLandmark
};