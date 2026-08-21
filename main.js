// ... Existing code ...

// Function to create main HTML with main landmark (improves accessibility)
export function createMainHTML({ children, id }) {
  return `
    <main id="${id}" aria-label="Main content">
      ${children}
    </main>
  `;
}

// Function to fix table structure issues by adding scope attributes to th tags
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
  
  // Add main landmark with proper id and aria-label
  result = result.replace(/<main([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = existingAttrs.includes('id=');
    const hasAriaLabel = existingAttrs.includes('aria-label=');
    let newAttrs = existingAttrs;
    if (!hasId) {
      newAttrs += ' id="main"';
    }
    if (!hasAriaLabel) {
      newAttrs += ' aria-label="Main content"';