// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

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
export function fixTableScope(html) {
  return html.replace(/<th((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = /\bscope\s*=/i.test(existingAttrs);
    if (hasScope) {
      return match;
    }
    return `<th${existingAttrs} scope="col">`;
  });
}

// Function to add lang attribute to HTML element
export function addLangAttribute(html) {
  return html.replace(/<html((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const hasLang = attrs && /\blang\s*=/i.test(attrs);
    if (hasLang) {
      return match;
    }
    const existingAttrs = attrs || '';
    return `<html lang="en"${existingAttrs}>`;
  });
}

// Function to add/fix landmark issues
export function addLandmarks(html) {
  let result = html;
  
  // Add main landmark with proper id and aria-label
  result = result.replace(/<main((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = /\bid\s*=/i.test(existingAttrs);
    const hasAriaLabel = /\baria-label\s*=/i.test(existingAttrs);
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
  result = result.replace(/<div((?:\s+[^>]*)?)(\s*)class\s*=\s*"([^"]*)"((?:\s+[^>]*)?)>/gi, (match, attrs1, space1, c1, attrs2) => {
    const existingAttrs = (attrs1 || '') + (attrs2 || '');
    const hasRole = /\brole\s*=/i.test(existingAttrs);
    if (!hasRole) {
      return `<div${attrs1 || ''}${space1}class="${c1}" role="banner"${attrs2 || ''}>`;
    }
    return match;
  });
  
  // Fix section landmarks
  result = result.replace(/<section((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/i.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/\bid\s*=\s*"([^"]*)"/i);
      const sectionId = idMatch ? idMatch[1] : '';
      const label = sectionId || 'Section';
      return `<section${existingAttrs} aria-label="${label}">`;
    }
    return match;
  });
  
  // Fix article landmarks
  result = result.replace(/<article((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/i.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      return `<article${existingAttrs} role="article">`;
    }
    return match;
  });
  
  // Fix nav landmarks
  result = result.replace(/<nav((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/i.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/i.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/\bid\s*=\s*"([^"]*)"/i);
      const navId = idMatch ? idMatch[1] : '';
      const label = navId || 'Navigation';
      return `<nav${existingAttrs} aria-label="${label}">`;
    }
    return match;
  });
  
  return result;
}

// Function to add accessible names to SVGs
export function addSvgAccessibility(html) {
  let result = html;
  
  // Add role and aria-label to svg elements
  result = result.replace(/<svg((?:\s+[^>]*)?)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasRole = /\brole\s*