// TODO: Remove the commented line and uncomment mainElement when available

// Function to create main HTML with main landmark (improves accessibility)
export function createMainHTML({ children, id }) {
  return `
    <main id="${id}" aria-label="Main content">
      ${children}
    </main>
  `;
}

// Main element with proper accessibility
export const mainElement = `<main id="main" aria-label="Main content"></main>`;

// Function to add lang attribute to HTML element
export function addLangToHtml(html) {
  return html.replace(/<html([^>]*)>/g, (match, attrs) => {
    const hasLang = attrs && /\blang\s*=/.test(attrs);
    if (hasLang) {
      return match;
    }
    const existingAttrs = attrs || '';
    return `<html${existingAttrs} lang="en">`;
  });
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

// Function to add/fix landmark issues
export function addLandmarks(html) {
  let result = html;
  
  // Helper to generate unique IDs for landmarks
  let landmarkIdCounter = 0;
  const getNextId = (prefix) => {
    const id = `${prefix}-${landmarkIdCounter++}`;
    return id;
  };

  // Add/main landmark with proper id and aria-label
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
  result = result.replace(/<div([^>]*)>([\s\S]*?)<\/div>/g, (match, attrs1, content, attrs2, attrs3) => {
    const existingAttrs = (attrs2 || '') + (attrs3 || '');
    const hasRole = /\brole\s*=/.test(existingAttrs);
    if (!hasRole) {
      // Ensure a unique id for the landmark div
      const idMatch = existingAttrs.match(/\bid\s*=\s*["']([^"']+)["']/);
      const uniqueId = idMatch ? idMatch[1] : getNextId('banner');
      return `<div${attrs1}><div id="${uniqueId}" role="banner">${content}</div></div>`;
    }
    return match;
  });

  // Fix section landmarks
  result = result.replace(/<section([^>]*)>/g, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/\bid\s*=\s*["']([^"']+)["']/);
      const sectionId = idMatch ? idMatch[1] : '';
      const label = sectionId || 'Section';
      // Ensure unique id if missing
      if (!idMatch) {
        const uid = getNextId('section');
        existingAttrs += ` id="${uid}"`;
      }
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
      if (!/\bid\s*=/.test(existingAttrs)) {
        const uid = getNextId('article');
        return `<article${existingAttrs} id="${uid}" role="article">`;
      }
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
      const idMatch = existingAttrs.match(/\bid\s*=\s*["']([^"']+)["']/);
      const navId = idMatch ? idMatch[1] : '';
      const label = navId || 'Navigation';
      // Ensure unique id if missing
      if (!idMatch) {
        const uid = getNextId('nav');
        return `<nav${existingAttrs} id="${uid}" aria-label="${label}">`;
      }
      return `<nav${existingAttrs} aria-label="${label}">`;
    }
    return match;
  });

  return result;
}

// Function to add accessible name to SVGs
export function addSvgAriaLabels(html) {
  let result = html;

  // Add role and aria-label to svg elements
  result = result.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/g, (match, attrs, inner) => {
    const existingAttrs = attrs || '';
    const hasRole = /\brole\s*=/.test(existingAttrs);
    const hasAriaLabel = /\baria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /\baria-labelledby\s*=/.test(existingAttrs);
    let newAttrs = existingAttrs;

    if (!hasRole) {
      newAttrs += ' role="img"';
    }

    // Try to obtain an accessible name from a nested <title> element
    const titleMatch = inner.match(/<title>([^<]+)<\/title>/);
    let accessibleName = 'Image';
    if (titleMatch) {
      accessibleName = titleMatch[1];
    }

    if (!hasAriaLabel && !hasAriaLabelledby) {
      newAttrs += ` aria-label="${accessibleName}"`;
    }

    return `<svg${newAttrs}>${inner}</svg>`;
  });

  return result;
}

// Function to fix 1 fake link issue
export function fixFakeLinks(html) {
  return html.replace(/<a([^>]*)>/g, (match, attrs) => {
    // Ensure href is present
    if (!/\bhref\s*=/.test(attrs)) {
      attrs += ' href="#"';
    }
    // Ensure accessible name if empty
    if (!attrs || !/\baria-label\s*=/.test(attrs) && !/\btitle\s*=/.test(attrs)) {
      attrs = attrs.replace(/\bclass\s*=\s*"([^"]*)"/, 'class="$1" aria-label="Link"');
      if (!/\baria-label\s*=/.test(attrs)) {
        attrs += ' aria-label="Link"';
      }
    }
    return `<a${attrs}>`;
  });
}