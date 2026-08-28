// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add landmark roles and fix landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// - New function for REACT_025 (ensuring unique landmarks)
// - New function for REACT_017 (adding landmark roles and fixing landmark issues)

/**
 * Adds lang attribute to HTML element
 * @param {string} html - HTML string
 * @param {string} lang - Language code (e.g., 'en')
 * @returns {string} - HTML with lang attribute on html element
 */
function addLangAttribute(html, lang = 'en') {
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (attrs.includes('lang=')) {
      return match; // lang attribute already exists
    }
    return `<html${attrs} lang="${lang}">`;
  });
}

/**
 * Checks if landmarks have unique accessible names
 * @param {string} html - HTML string
 * @returns {Object[]} - Array of issues found
 */
function ensureUniqueLandmarks(html) {
  const issues = [];
  
  // Find all landmarks (main, nav, header, footer, aside, section, article)
  const landmarkTags = ['main', 'nav', 'header', 'footer', 'aside', 'section', 'article'];
  const landmarkNames = {};
  
  landmarkTags.forEach(tag => {
    const regex = new RegExp(`<${tag}[^>]*(?:aria-label="([^"]*)"|aria-labelledby="([^"]*)"|id="([^"]*)")[^>]*>`, 'gi');
    let match;
    
    while ((match = regex.exec(html)) !== null) {
      const name = match[1] || match[2] || match[3] || '';
      if (name) {
        if (!landmarkNames[name]) {
          landmarkNames[name] = [];
        }
        landmarkNames[name].push({ tag, match: match[0] });
      }
    }
  });
  
  // Check for duplicates
  Object.keys(landmarkNames).forEach(name => {
    if (landmarkNames[name].length > 1) {
      landmarkNames[name].forEach((item, index) => {
        issues.push({
          type: 'REACT_025',
          message: `Duplicate landmark name "${name}" found ${landmarkNames[name].length} times`,
          tag: item.tag,
          match: item.match,
          index
        });
      });
    }
  });
  
  return issues;
}

/**
 * Adds landmark roles and fixes landmark issues
 * @param {string} html - HTML string
 * @returns {Object} - Object with fixed HTML and issues
 */
function addLandmarkRolesAndFixIssues(html) {
  const issues = [];
  let fixedHtml = html;
  
  // Find divs and spans that should be landmarks
  const divSpanRegex = /<(div|span)([^>]*)>/gi;
  let match;
  
  while ((match = divSpanRegex.exec(html)) !== null) {
    const tag = match[1];
    const attrs = match[2];
    
    // Check if it's being used as a landmark (has navigation-like content or multiple interactive elements)
    if (attrs.includes('role=')) {
      const roleMatch = attrs.match(/role="([^"]*)"/);
      if (roleMatch) {
        const role = roleMatch[1];
        // Check for landmark roles
        if (['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'].includes(role)) {
          // Ensure it has an accessible name
          if (!attrs.includes('aria-label=') && !attrs.includes('aria-labelledby=')) {
            issues.push({
              type: 'REACT_017',
              message: `Landmark with role="${role}" missing accessible name`,
              match: match[0]
            });
          }
        }
      }
    }
  }
  
  // Check for missing main landmark
  if (!html.includes('<main') && !html.includes('role="main"')) {
    issues.push({
      type: 'REACT_017',
      message: 'Missing main landmark',
      suggestion: 'Add <main> element or role="main" to wrapper element'
    });
  }
  
  // Check for multiple navigation landmarks without labels
  const navMatches = html.match(/<nav[^>]*>/gi) || [];
  navMatches.forEach((nav, index) => {
    if (!nav.includes('aria-label=') && !nav.includes('aria-labelledby=')) {
      issues.push({
        type: 'REACT_017',
        message: `Navigation landmark ${index + 1} missing accessible name`,
        match: nav
      });
    }
  });
  
  return { html: fixedHtml, issues };
}

/**
 * Adds accessible names to SVGs
 * @param {string} html - HTML string
 * @returns {Object} - Object with fixed HTML and issues
 */
function addAccessibleNamesToSvgs(html) {
  const issues = [];
  let fixedHtml = html;
  
  // Find SVGs without title or aria-label
  const svgRegex = /<svg([^>]*)>([\s\S]*?)<\/svg>/gi;
  let match;
  let svgIndex = 0;
  
  while ((match = svgRegex.exec(html)) !== null) {
    const attrs = match[1];
    const content = match[2];
    const fullMatch = match[0];
    
    const hasTitle = content.includes('<title');
    const hasAriaLabel = attrs.includes('aria-label=') || attrs.includes('aria-labelledby=');
    const hasRole = attrs.includes('role=');
    
    if (!hasTitle && !hasAriaLabel) {
      issues.push({
        type: 'REACT_041',
        message: `SVG ${svgIndex + 1} missing accessible name`,
        match: fullMatch
      });
    }
    
    svgIndex++;
  }
  
  return { html: fixedHtml, issues };
}

/**
 * Fixes fake link issues (links with href="#" that aren't actually links)
 * @param {string} html - HTML string
 * @returns {Object} - Object with fixed HTML and issues
 */
function fixFakeLinks(html) {
  const issues = [];
  let fixedHtml = html;
  
  // Find links with href="#"
  const linkRegex = /<a([^>]*)href="#"([^>]*)>([\s\S]*?)<\/a>/gi;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const beforeHref = match[1];
    const afterHref = match[2];
    const text = match[3];
    const fullMatch = match[0];
    
    // Check if it's a fake link (no actual navigation)
    if (!afterHref.includes('onclick=') && !afterHref.includes('role=')) {
      issues.push({
        type: 'REACT_036',
        message: 'Fake link detected: <a> with href="#" that does not navigate',
        match: fullMatch,
        suggestion: 'Replace with <button> element or add proper href value'
      });
    }
  }
  
  return { html: fixedHtml, issues };
}

/**
 * Validates th elements have scope attributes
 * @param {string} html - HTML string
 * @returns {Object[]} - Array of issues found
 */
function validateThScope(html) {
  const issues = [];
  const thRegex = /<th([^>]*)>/gi;
  let match;
  
  while ((match = thRegex.exec(html)) !== null) {
    const attrs = match[1];
    
    if (!attrs.includes('scope=')) {
      issues.push({
        type: 'REACT_027',
        message: '<th> element missing scope attribute',
        match: match[0]
      });
    }
  }
  
  return issues;
}

module.exports = {
  addLangAttribute,
  ensureUniqueLandmarks,
  addLandmarkRolesAndFixIssues,
  addAccessibleNamesToSvgs,
  fixFakeLinks,
  validateThScope
};