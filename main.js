function addLangAttributeToHtml(htmlContent) {
  // Use default language 'en' if none provided
  const langValue = getLangAttribute('en');
  const fullLangValue = getFullLangAttribute('en', null);

  // If <html> tag exists, inject the lang attribute
  if (/<html\b/i.test(htmlContent)) {
    return htmlContent.replace(/<html\b/gi, `<html${langAttr}`);
  }
  // Otherwise prepend a wrapping <html> tag with the lang attribute
  return `<html${langAttr}>${htmlContent}</html>`;
}

function validateTableAccessibility(htmlContent) {
  // Add scope attributes to table headers
  const thRegex = /<th(?![^>]*\bscope\b)[^>]*>/gi;
  let modifiedContent = htmlContent.replace(thRegex, (match) => {
    return match.replace('>', ' scope="col">');
  });
  return modifiedContent;
}

function validateTableStructure(htmlContent) {
  // Ensure tables have proper structure with thead and tbody
  let modifiedContent = htmlContent;

  const tableRegex = /<table([^>]*)>([\s\S]*?)(?:<thead([\s\S]*?)<\/thead>)?([\s\S]*?)(?:<tbody([\s\S]*?)<\/tbody>)?([\s\S]*?)<\/table>/gi;
  modifiedContent = htmlContent.replace(tableRegex, (match, attrs, before, thead, tbody, tbody2, after) => {
    let result = `<table${attrs}>`;

    if (thead) {
      result += `<thead${thead}</thead>`;
    }

    if (tbody || tbody2) {
      result += `<tbody${tbody || tbody2}</tbody>`;
    } else if (!thead) {
      // Wrap content in tbody if no thead
      const content = before + (tbody2 || '');
      result += `<tbody>${content}</tbody>`;
    }

    result += `</table>`;
    return result;
  });

  return modifiedContent;
}

function validateLandmark(htmlContent) {
  let modifiedContent = htmlContent;

  // Add main landmark if not present
  if (!/<main[\s>]/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/<body([^>]*)>/i, '<main$1>');
  }

  return modifiedContent;
}

function validateLandmarkStructure(htmlContent) {
  // Ensure proper landmark nesting and structure
  let modifiedContent = htmlContent;

  // Add header and footer landmarks if missing
  if (!/<header/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/(<body[^>]*>)/i, '$1<header role="banner"><nav role="navigation"></nav></header>');
  }

  if (!/<footer/i.test(modifiedContent)) {
    modifiedContent = modifiedContent.replace(/<\/body>/i, '</main><footer role="contentinfo"></footer></body>');
  }

  return modifiedContent;
}

function getSvgAccessibleName(svgContent, accessibleName) {
  if (!accessibleName) return svgContent;

  // Add title element to SVG for accessibility
  if (!svgContent.includes('<title')) {
    return svgContent.replace('<svg', `<svg><title>${accessibleName}</title>`);
  }

  return svgContent;
}

function createAccessibleLink(url, text, options = {}) {
  const { className = '', target = '_self', rel = '' } = options;

  const relAttr = rel || (target === '_blank' ? 'noopener noreferrer' : '');

  return `<a href="${url}" target="_${target}"${relAttr ? ` rel="${relAttr}"` : ''}${className ? ` class="${className}"` : ''}>${text}</a>`;
}

function createInPageButton(text, options = {}) {
  const { className = '', id = '', ariaLabel = '' } = options;

  const idAttr = id ? ` id="${id}"` : '';
  const classAttr = className ? ` class="${className}"` : '';
  const ariaAttr = ariaLabel ? ` aria-label="${ariaLabel}"` : '';

  return `<button type="button"${idAttr}${classAttr}${ariaAttr}>${text}</button>`;
}

function addAccessibleNameToSVGs(htmlContent) {
  // Regex to find SVG elements without an accessible name
  const svgRegex = /<svg[^>]*>([\s\S]*?)(?=<\/svg>)/gi;

  let modifiedContent = htmlContent;
  let match;

  // Loop through all SVG elements and add aria-label or title as accessible name
  while ((match = svgRegex.exec(modifiedContent)) !== null) {
    const svgContent = match[1];
    const accessibleName = 'SVG Content'; // Default accessible name

    // Check if SVG already has a title or aria-hidden
    if (!svgContent.includes('<title') && !svgContent.includes('aria-hidden="true"')) {
      modifiedContent = modifiedContent.replace(match[0], getSvgAccessibleName(match[0], accessibleName));
    }
  }

  return modifiedContent;
}

function wrapMainTags(htmlContent) {
  // Inject lang attribute into the root element first
  htmlContent = addLangAttributeToHtml(htmlContent);

  // Check if the HTML content already has <main> tag
  const isMainTagExists = /<main[\s>]/i.test(htmlContent);

  if (!isMainTagExists) {
    // Wrap the content inside a <main> tag
    const container = htmlContent;
    const modifiedContent = `<main>${container}</main>`;
    return modifiedContent;
  }

  return htmlContent;
}

module.exports = {
  wrapMainTags,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  createAccessibleLink,
  createInPageButton,
  addAccessibleNameToSVGs
};