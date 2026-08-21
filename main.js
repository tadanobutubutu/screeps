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
  return html.replace(/<th([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = /\bscope\s*=/.test(existingAttrs);
    if (hasScope) {
      return match;
    }
    return `<th${existingAttrs} scope="col">`;
  });
}

// Function to add lang attribute to HTML element
export function addLangAttribute(html) {
  return html.replace(/<html([^>]*)>/g, (match, attrs) => {
    const hasLang = attrs && /\blang\s*=/.test(attrs);
    if (hasLang) {
      return match;
    }
    const existingAttrs = attrs || '';
    return `<html${existingAttrs} lang="en">`;
  });
}

// Function to add/fix landmark issues
export function addLandmarks(html) {
  let result = html;
  
  // Add main landmark with proper id and aria-label
  result = result.replace(/<main([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = /\bid\s*=/.test(existingAttrs);
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
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
  result = result.replace(/<div(\s+)([^>]*?)class="([^"]*)"([^>]*)>/g, (match, attrs1, attrs2, c1, attrs3) => {
    const existingAttrs = (attrs2 || '') + (attrs3 || '');
    const hasRole = /\brole\s*=/.test(existingAttrs);
    if (!hasRole) {
      return `<div${attrs1}${attrs2}class="${c1}" role="banner"${attrs3}>`;
    }
    return match;
  });
  
  // Fix section landmarks
  result = result.replace(/<section([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/id="([^"]*)"/);
      const sectionId = idMatch ? idMatch[1] : '';
      const label = sectionId || 'Section';
      return `<section${existingAttrs} aria-label="${label}">`;
    }
    return match;
  });
  
  // Fix article landmarks
  result = result.replace(/<article([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      return `<article${existingAttrs} role="article">`;
    }
    return match;
  });
  
  // Fix nav landmarks
  result = result.replace(/<nav([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/id="([^"]*)"/);
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
  result = result.replace(/<svg([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasRole = /\brole\s*=/.test(existingAttrs);
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    
    let newAttrs = existingAttrs;
    
    if (!hasRole) {
      newAttrs += ' role="img"';
    }
    
    if (!hasAriaLabel && !hasAriaLabelledby) {
      newAttrs += ' aria-label="Image"';
    }
    
    return `<svg${newAttrs}>`;
  });
  
  return result;
}