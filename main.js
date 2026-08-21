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
  return html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = /scope\s*=/i.test(existingAttrs);
    const scopeAttr = hasScope ? '' : ' scope="col"';
    const attrString = existingAttrs;
    return `<th${attrString}${scopeAttr}>`;
  });
}

// Function to add lang attribute to HTML element
export function addLangAttribute(html) {
  return html.replace(/<html([^>]*)>/gi, (match, attrs) => {
    const hasLang = attrs && /lang\s*=/i.test(attrs);
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
  result = result.replace(/<main([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = /id\s*=/i.test(existingAttrs);
    const hasAriaLabel = /aria-label\s*=/i.test(existingAttrs);
    let newAttrs = existingAttrs;
    if (!hasId) {
      newAttrs += ' id="main"';
    }
    if (!hasAriaLabel) {
      newAttrs += ' aria-label="Main content"';
    }
    return `<main${newAttrs}>`;
  });
  
  // Fix div landmarks
  result = result.replace(/<div([^>]*)class="([^"]*)"([^>]*)>/gi, (match, attrs1, c1, c2, attrs2) => {
    const existingAttrs = (attrs1 || '') + (attrs2 || '');
    const hasRole = /role\s*=/i.test(existingAttrs);
    if (!hasRole) {
      return `<div${attrs1 || ''} class="${c1}${c2}" role="banner"${attrs2 || ''}>`;
    }
    return match;
  });
  
  // Fix section landmarks
  result = result.replace(/<section([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/i.test(existingAttrs) || /aria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel) {
      const idMatch = existingAttrs.match(/id="([^"]*)"/);
      const sectionId = idMatch ? idMatch[1] : '';
      return `<section${existingAttrs} aria-label="${sectionId || 'Section'}">`;
    }
    return match;
  });
  
  // Fix article landmarks
  result = result.replace(/<article([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/i.test(existingAttrs) || /aria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel) {
      return `<article${existingAttrs} role="article">`;
    }
    return match;
  });
  
  // Fix nav landmarks
  result = result.replace(/<nav([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/i.test(existingAttrs) || /aria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel) {
      return `<nav${existingAttrs} aria-label="Navigation">`;
    }
    return match;
  });
  
  return result;
}

// Function to add accessible names to SVGs
export function addSvgAccessibility(html) {
  let result = html;
  
  // Add role and aria-label to svg elements
  result = result.replace(/<svg([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasRole = /role\s*=/i.test(existingAttrs);
    const hasAriaLabel = /aria-label\s*=/i.test(existingAttrs);
    let newAttrs = existingAttrs;
    if (!hasRole) {
      newAttrs += ' role="img"';
    }
    if (!hasAriaLabel) {
      newAttrs += ' aria-label="Icon"';
    }
    return `<svg${newAttrs}>`;
  });
  
  // Add title element inside SVGs if not present
  result = result.replace(/(<svg[^>]*>)(?!.*<title>)/gi, (match, openTag) => {
    return `${openTag}<title>Image</title>`;
  });
  
  return result;
}

// Function to ensure unique landmarks
export function ensureUniqueLandmarks(html) {
  const landmarks = ['main', 'region', 'article', 'navigation', 'header', 'footer', 'aside'];
  const htmlArray = html.split('</');
  let isLandmarkTag = false;
  let newHtmlArray = [];
  let counter = {};
  
  // Initialize counters for each landmark type
  landmarks.forEach(lm => {
    counter[lm] = 0;
  });
  
  htmlArray.forEach((tag, index) => {
    if (tag.includes('<') && landmarks.some(lm => tag.toLowerCase().includes(`<${lm}`))) {
      isLandmarkTag = true;
      let tagToCheck = tag.toLowerCase();
      for (const lm of landmarks) {
        if (tagToCheck.includes(`<${lm}`)) {
          counter[lm]++;
          if (counter[lm] > 1) {
            const uniqueId = `${lm}-${counter[lm]}`;
            // Add unique id to the opening tag
            if (!