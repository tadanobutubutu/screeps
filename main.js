// main.js - Accessibility helpers for React landmarks

/**
 * Wraps content in a main landmark element for accessibility
 * @param {React.ReactNode} children - Content to wrap
 * @returns {JSX.Element} - Content wrapped in <main> tag
 */
export function withMainLandmark(children) {
  return <main>{children}</main>;
}

/**
 * Validates that a component has a main landmark
 * @param {string} htmlContent - HTML string to validate
 * @returns {boolean} - True if main landmark exists
 */
export function hasMainLandmark(htmlContent) {
  return /<main[\s\S]*?>[\s\S]*?<\/main>/i.test(htmlContent);
}

/**
 * Adds main landmark around primary content if missing
 * @param {string} htmlContent - HTML string to modify
 * @returns {string} - Modified HTML with main landmark
 */
export function ensureMainLandmark(htmlContent) {
  if (hasMainLandmark(htmlContent)) {
    return htmlContent;
  }
  
  // Extract content between body tags or use entire content
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : htmlContent;
  
  return htmlContent.replace(
    content,
    `<main>${content}</main>`
  );
}

// ... existing code preserved ...