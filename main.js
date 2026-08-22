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

// Function to create section HTML for non-main landmarks (improves accessibility)
// Use this for error/success states or other content regions that shouldn't be main landmarks
export function createSectionHTML({ id, label, children }) {
  return `
    <section id="${id}" aria-label="${label}">
      ${children}
    </section>
  `;
}

// Function to create article HTML for article landmarks (improves accessibility)
// Use this for self-contained content that makes sense on its own
export function createArticleHTML({ id, label, children }) {
  return `
    <article id="${id}" aria-label="${label}">
      ${children}
    </article>
  `;
}

// Function to add lang attribute to HTML element
export function addLangToHtml(html) {
  return html.replace(/<([hH][tT][mM][lL])([^>]*)>/, (match, tagName, attrs) => {
    if (/\blang\s*=/.test(attrs)) {
      return match;
    }
    return `<${tagName}${attrs} lang="en">`;
  });
}

// Function to fix table structure issues by adding scope attributes to th tags
// This improves accessibility by properly associating header cells with data cells
export function fixTableScope(html) {
  return html.replace(/<th(?![^>]*\bscope\b)([^>]*)>/gi, (match, attrs) => {
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
  result = result.replace(/<main(?!([^>]*\bid\s*=|aria-label=)[^>]*>)([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = /\bid\s*=/.test(existingAttrs);
    const hasAriaLabel = /aria-label\s*=/.test(existingAttrs);
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
  result = result.replace(/<div([^>]*)>(\s*<div)([^>]*)>(\s*)(<div)([^>]*)>(\s*<\/div>)(\s*<\/div>)(\s*<\/div>)/gi, (match, attrs1, content, attrs2, space, div3, attrs3) => {
    const existingAttrs = (attrs2 || '') + (attrs3 || '');
    const hasRole = /role\s*=/.test(existingAttrs);
    if (!hasRole) {
      // Ensure a unique id for the landmark div
      const idMatch = existingAttrs.match(/id\s*=\s*["']([^"']+)["']/);
      const uniqueId = idMatch ? idMatch[1] : getNextId('banner');
      return `<div${attrs1}><div id="${uniqueId}" role="banner"${content}`;
    }
    return match;
  });

  // Fix section landmarks
  result = result.replace(/<section(?!([^>]*\baria-label\s*=|aria-labelledby\s*=)[^>]*>)([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /aria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/id\s*=\s*["']([^"']+)["']/);
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
  result = result.replace(/<article(?!([^>]*\baria-label\s*=|aria-labelledby\s*=)[^>]*>)([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /aria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/id\s*=\s*["']([^"']+)["']/);
      if (!idMatch) {
        const uid = getNextId('article');
        return `<article${existingAttrs} id="${uid}" role="article">`;
      }
      return `<article${existingAttrs} role="article">`;
    }
    return match;
  });

  // Fix nav landmarks
  result = result.replace(/<nav(?!([^>]*\baria-label\s*=|aria-labelledby\s*=)[^>]*>)([^>]*)>/gi, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasAriaLabel = /aria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /aria-labelledby\s*=/.test(existingAttrs);
    if (!hasAriaLabel && !hasAriaLabelledby) {
      const idMatch = existingAttrs.match(/id\s*=\s*["']([^"']+)["']/);
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

// Function to add accessible names to SVGs
export function addSvgAccessibility(html) {
  let result = html;

  // Add role and aria-label to svg elements
  result = result.replace(/<svg([^>]*)>([\s\S]*?)<\/svg>/gi, (match, attrs, inner) => {
    const existingAttrs = attrs || '';
    const hasRole = /role\s*=/.test(existingAttrs);
    const hasAriaLabel = /aria-label\s*=/.test(existingAttrs);
    const hasAriaLabelledby = /aria-labelledby\s*=/.test(existingAttrs);
    let newAttrs = existingAttrs;

    if (!hasRole) {
      newAttrs += ' role="img"';
    }

    // Try to obtain an accessible name from a nested <title> element
    const titleMatch = inner.match(/<title[^>]*>([^<]+)<\/title>/i);
    let accessibleName = 'Image';
    if (titleMatch) {
      accessibleName = titleMatch[1].trim();
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
  return html.replace(/<a(?![^>]*\bhref\b)([^>]*)>/gi, (match, attrs) => {
    // Ensure href is present
    if (!/\bhref\s*=/.test(attrs)) {
      attrs += ' href="#"';
    }
    // Ensure accessible name if empty
    if (!attrs || (/\bclass\s*=\s*["'][^"']*["']/.test(attrs) && !/\btext\s*=/.test(attrs))) {
      attrs = attrs.replace(/class\s*=\s*["']([^"']+)["']/, 'class="$1"');
      if (!/\baria-label\s*=/.test(attrs)) {
        attrs += ' aria-label="Link"';
      }
    }
    return `<a${attrs}>`;
  });
}