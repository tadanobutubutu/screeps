// ... Existing code ...

// Function to create main HTML with main landmark (improves accessibility)
export function createMainHTML({ children, id }) {
  return `
    <main id="${id}" aria-label="Main content">
      ${children}
    </main>
  `;
}

// Function to fix table structure issues by adding proper attributes to header tags
// This improves accessibility by properly associating header cells with data cells
export function fixTableStructure(html) {
  return html.replace(/<th([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = existingAttrs.includes('scope');
    const scopeAttr = hasScope ? '' : ' scope="col"';
    const attrString = existingAttrs;
    return `<th${attrString}${scopeAttr}>`;
  });
}

// Function to add lang attribute to HTML element
export function addLangAttribute(html) {
  return html.replace(/<html([^>]*)>/g, (match, attrs) => {
    const hasLang = attrs && attrs.includes('lang=');
    if (hasLang) {
      return match;
    }
    return `<html lang="en"${attrs ? attrs : ''}>`;
  });
}

// Function to add/fix landmark issues
export function addLandmarks(html) {
  let result = html;
  
  // Add main landmark with proper id and aria-label if not already present
  result = result.replace(/<body([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    // Check if main landmark already exists
    if (!result.includes('<main')) {
      // Wrap all body content in main landmark
      return `<body${existingAttrs}><main id="main" aria-label="Main content">`;
    }
    return match;
  });
  
  // Close main landmark tag at the end of body
  result = result.replace(/<\/body>/, () => {
    if (!result.includes('</main>')) {
      return '</main></body>';
    }
    return '</body>';
  });
  
  return result;
}