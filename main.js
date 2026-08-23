// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// ... existing functionality ...

// Example fix for the React Fake Link issue:
// Change the HTML from:
// <a id="unrotate" href="#">rotate back</a>
// To:
// <button id="unrotate">rotate back</button>
// And update any JavaScript handlers accordingly

// New functions added to address TODO at line 78
const addLangAttribute = (htmlContent = '', lang = 'en') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }

  // Check if lang attribute already exists
  if (/<html[^>]*lang=/.test(htmlContent)) {
    return htmlContent.replace(/lang="[^"]*"/, `lang="${lang}"`);
  }

  // Add lang attribute to html tag
  return htmlContent.replace(/<html([^>]*)>/, `<html$1 lang="${lang}">`);
};

const addMainLandmark = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }

  // Check if main landmark already exists
  if (/<main[^>]*>/.test(htmlContent) || /<div[^>]*role="main"[^>]*>/.test(htmlContent)) {
    return htmlContent;
  }

  // Add role="main" to the most appropriate container or wrap main content
  return htmlContent.replace(
    /(<body[^>]*>)([\s\S]*)(<\/body>)/,
    '$1<main>$2</main>$3'
  );
};

const ensureUniqueLandmarks = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }

  let result = htmlContent;

  // Ensure only one header landmark - convert subsequent headers to non-landmark
  const headerMatches = result.match(/<header[^>]*>/g) || [];
  if (headerMatches.length > 1) {
    let headerCount = 0;
    result = result.replace(/<header[^>]*>/g, (match) => {
      headerCount++;
      return headerCount === 1 ? match : match.replace(/role="banner"/, '');
    });
  }

  // Ensure only one footer landmark - convert subsequent footers to non-landmark
  const footerMatches = result.match(/<footer[^>]*>/g) || [];
  if (footerMatches.length > 1) {
    let footerCount = 0;
    result = result.replace(/<footer[^>]*>/g, (match) => {
      footerCount++;
      return footerCount === 1 ? match : match.replace(/role="contentinfo"/, '');
    });
  }

  return result;
};

const addAriaLabelToMyDiv = (htmlContent = '') => {
  if (typeof htmlContent !== 'string') {
    return htmlContent;
  }

  // Find divs with role="link" that lack accessible names
  return htmlContent.replace(
    /<div([^>]*)role="link"([^>]*)>/g,
    (match, before, after) => {
      const hasAriaLabel = /aria-label|aria-labelledby/.test(before + after);
      if (hasAriaLabel) {
        return match;
      }
      // Add aria-label with a default accessible name
      return `<div${before}role="link" aria-label="Link"${after}>`;
    }
  );
};

// ... existing functions preserved: ...

module.exports = {
  mainFunc,
  newFunc,
  fixTableStructureIssues,
  addMainLandmark,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  addAriaLabelToMyDiv,
  // ... other exports if any ...
  newFunctionForTheIssue,
  addLangAttribute,
  // New functions added to address TODO at line 78
  dependencyGraphContent,
  indexContent
};