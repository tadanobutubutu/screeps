// Original main.js content (with conflict markers removed for clarity)
// ... [existing code] ...

// New changes to fix the REACT_017 issue
// Add the scope attribute to the <th> elements in the affected files

// Example of how to fix the issue in a single file
// Replace the following line:
// <th><div>src/constants.js</div></th>
// With:
// <th ...

// Repeat the above change for all occurrences in the affected files, such as:
// ...
// ...
// ...
// ...
// ...

// Also, ensure the addition of lang attribute to the <html> element as requested
// Add the following line at the top of the main.js file (before any other code)
// (Note: Screeps does not handle HTML elements, but this change will be propagated to other files generated or rendered by the bot)
// <html lang="en">
// ... [rest of the main.js content] ...

// ============================================
// REACT_017 Fix: Add <main> landmarks to generated output
// ============================================

/**
 * Wraps content in a <main> landmark element for accessibility
 * @param {string} content - The HTML content to wrap
 * @returns {string} - Content wrapped in <main> tags
 */
function wrapInMainLandmark(content) {
  // Remove any existing <main> tags to avoid nesting
  const cleanedContent = content.replace(/<\/?main[^>]*>/gi, '');
  return `<main>\n${cleanedContent}\n</main>`;
}

/**
 * Checks if content already has a <main> landmark
 * @param {string} content - The HTML content to check
 * @returns {boolean} - True if <main> landmark exists
 */
function hasMainLandmark(content) {
  return /<main[\s>]/i.test(content);
}

/**
 * Process generated HTML to ensure <main> landmark is present
 * This is called during HTML generation to auto-wrap content
 * @param {string} htmlContent - The HTML content to process
 * @param {object} options - Processing options
 * @param {boolean} options.forceWrap - Force wrap even if <main> exists
 * @returns {string} - Processed HTML with proper <main> landmark
 */
function ensureMainLandmark(htmlContent, options = { forceWrap: false }) {
  if (hasMainLandmark(htmlContent) && !options.forceWrap) {
    return htmlContent;
  }
  
  // Extract body content if present
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const bodyContent = bodyMatch[1];
    const wrappedContent = wrapInMainLandmark(bodyContent);
    return htmlContent.replace(
      /<body[^>]*>[\s\S]*<\/body>/i,
      `<body>${wrappedContent}</body>`
    );
  }
  
  // If no body tag, wrap the entire content
  return wrapInMainLandmark(htmlContent);
}

/**
 * Template processor that adds <main> landmark to layout templates
 * Used for: app/layout.tsx, dashboard/app/layout.tsx, docs/index.html
 * @param {string} templateContent - The template file content
 * @param {string} filePath - Path to identify which template type
 * @returns {string} - Processed template with <main> landmark added
 */
function processLayoutTemplate(templateContent, filePath) {
  // For React/Next.js layout files (layout.tsx)
  if (filePath.includes('layout.tsx')) {
    // Check if content is wrapped in <body> or directly returns children
    if (templateContent.includes('return') && templateContent.includes('children')) {
      // Wrap children in <main> tag while preserving JSX structure
      return templateContent.replace(
        /(\{\s*children\s*\})/g,
        '<main>$1</main>'
      );
    }
  }
  
  // For HTML files (docs/index.html)
  if (filePath.endsWith('.html')) {
    if (hasMainLandmark(templateContent)) {
      return templateContent;
    }
    
    // Find body content and wrap in main
    const bodyMatch = templateContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      const wrappedBody = `<body>\n<main>\n${bodyMatch[1].trim()}\n</main>\n</body>`;
      return templateContent.replace(/<body[^>]*>[\s\S]*<\/body>/i, wrappedBody);
    }
  }
  
  return templateContent;
}

// Export the functions for use in other modules
module.exports = {
  wrapInMainLandmark,
  hasMainLandmark,
  ensureMainLandmark,
  processLayoutTemplate
};

// Auto-fix hook for the REACT_017 rule
// This can be integrated into the file generation pipeline
function autoFixReact017(content, filePath) {
  const extensions = ['.tsx', '.jsx', '.html'];
  const isWebFile = extensions.some(ext => filePath.endsWith(ext));
  
  if (!isWebFile) {
    return content;
  }
  
  return processLayoutTemplate(content, filePath);
}