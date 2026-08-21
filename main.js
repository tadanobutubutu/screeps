export function createMainHTML({ children, id }) {
  return `
    <main id="${id}" aria-label="Main content">
      ${children}
    </main>
  `;
}

export const mainElement = `<main id="main" aria-label="Main content"></main>`;

export function addLangToHtml(html) {
  return html.replace(/<html(.*?)>/i, (match, attrs) => {
    const hasLang = attrs && /\blang\s*=/.test(attrs);
    if (hasLang) {
      return match;
    }
    const existingAttrs = attrs || '';
    return `<html${existingAttrs} lang="en">`;
  });
}

export function fixTableScope(html) {
  return html.replace(/<th(.*?)>/i, (match, attrs) => {
    const existingAttrs = attrs || '';
    const hasScope = /\bscope\s*=\s*col\b/.test(attrs);
    if (hasScope) {
      return match;
    }
    return `<th${existingAttrs} scope="col">`;
  });
}

export function addLandmarks(html) {
  let result = html;
  
  let landmarkIdCounter = 0;
  const getNextId = (prefix) => {
    const id = `landmark-${prefix}-${landmarkIdCounter++}`;
    return id;
  };

  result = result.replace(/<[a-z][^\>]*>/i, (match, tag, attrs) => {
    const existingAttrs = attrs || '';
    const hasId = /\bid\s*=\s*[\"\'](?:main|unique)[\"\']/i.test(attrs);
    const hasAriaLabel = /\baria-label\b/.test(attrs);
    
    let newAttrs = existingAttrs;
    if (!hasId) {
      newAttrs += ' id="' + getNextId('main') + '"';
    }
    if (!hasAriaLabel) {
      newAttrs += ' aria-label="Main content"';
    }
    return `<${tag}${newAttrs}>`;
  });

  return result;
}

export function addAccessibleNamesToSVGs(html) {
  let result = html;

  result = result.replace(/<svg(.*?)>/i, (match, attrs, inner) => {
    const existingAttrs = attrs || '';
    const hasRole = /\brole\b/.test(attrs);
    const hasAriaLabel = /\baria-label\b/.test(attrs);
    const hasAriaLabelledby = /\baria-labelledby\b/.test(attrs);
    
    let newAttrs = existingAttrs;
    if (!hasRole) {
      newAttrs += ' role="img"';
    }

    const titleMatch = inner.match(/<title[^>]*>(.*?)<\/title>/i);
    let accessibleName = 'Image';
    if (titleMatch) {
      accessibleName = titleMatch[1].trim() || 'Image';
    }

    if (!hasAriaLabel && !hasAriaLabelledby) {
      newAttrs += ` aria-label="${accessibleName}"`;
    }

    return `<svg${newAttrs}>${inner}</svg>`;
  });

  return result;
}

export function fixFakeLinks(html) {
  return html.replace(/<a(.*?)>/i, (match, attrs) => {
    const hasHref = /\bhref\b/.test(attrs);
    const hasAriaLabel = /\baria-label\b/.test(attrs);
    
    let newAttrs = attrs || '';
    if (!hasHref) {
      newAttrs += ' href="#"';
    }
    if (!hasAriaLabel && !/\bhref\b/.test(attrs)) {
      newAttrs += ' aria-label="Link"';
    }
    
    return `<a${newAttrs}>`;
  });
}