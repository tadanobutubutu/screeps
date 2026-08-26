// Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?

// REACT_015: React Language Attribute Rule
// Checks that <html> element has a lang attribute for accessibility

/**
 * Checks if the provided HTML has a lang attribute on the root <html> element
 * @param {string} html - The HTML content to analyze
 * @returns {object} - An object with 'hasLang' boolean and 'langValue' string
 */
function checkHtmlLangAttribute(html) {
  const langRegex = /<html[^>]*lang\s*=\s*["']([^"']+)["'][^>]*>/i;
  const match = html.match(langRegex);
  
  return {
    hasLang: match !== null,
    langValue: match ? match[1] : null
  };
}

/**
 * Validates REACT_015: Ensures <html> has a lang attribute
 * @param {string} html - The HTML content to validate
 * @returns {object} - Validation result with pass/fail status and message
 */
function validateReact015(html) {
  const langCheck = checkHtmlLangAttribute(html);
  
  return {
    rule: 'REACT_015',
    pass: langCheck.hasLang,
    message: langCheck.hasLang 
      ? `Valid: <html> has lang="${langCheck.langValue}"`
      : 'REACT_015 Violation: <html> has no lang attribute. Screen readers may default to incorrect language.'
  };
}

// Preserve existing exports if any
module.exports = {
  checkHtmlLangAttribute,
  validateReact015
};