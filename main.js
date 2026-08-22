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
  result = result.replace(/<div(\s+)([^>]*?)class="([^"]*)"([^>]*)>/g, (match, attrs1, attrs2, c1, attrs3) => {
    const existingAttrs = (attrs2 || '') + (attrs3 || '');
    const hasRole = /\brole\s*=/.test(existingAttrs);
    if (!hasRole) {
      // Ensure a unique id for the landmark div
      const idMatch = existingAttrs.match(/\bid\s*=\s*["']([^"']+)["']/i);
      const uniqueId = idMatch ? idMatch[1] : `div-landmark-${getNextId('div')}`;
      return `<div${attrs1}${attrs2}class="${c1}" role="banner" id="${uniqueId}"${attrs3}>`;
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
      // Ensure unique id if missing
      if (!/\bid\s*=/.test(existingAttrs)) {
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
        existingAttrs += ` id="${uid}"`;
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
      const idMatch = existingAttrs.match(/id="([^"]*)"/);
      const navId = idMatch ? idMatch[1] : '';
      const label = navId || 'Navigation';
      // Ensure unique id if missing
      if (!/\bid\s*=/.test(existingAttrs)) {
        const uid = getNextId('nav');
        existingAttrs += ` id="${uid}"`;
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
    const titleMatch = inner.match(/<title>([\s\S]*?)<\/title>/i);
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
function fixFakeLinks(html) {
  return html.replace(/<a\s+([^>]*>)/gi, (match, attrs) => {
    // Ensure href is present
    if (!/\bhref\s*=/i.test(attrs)) {
      attrs += ' href="#"';
    }
    // Ensure accessible name if empty
    if (/>[\s]*<\/a>/i.test(match) || match.replace(/<[^>]*>/g, '').trim() === '') {
      attrs += ' aria-label="Link"';
    }
    return `<a${attrs}>`;
  });
}

// TODO: Address accessibility issues from insight report
// Added accessibility-related functionality

/**
 * Adds accessibility attributes to a button element
 * @param {HTMLElement} button - The button element to enhance
 */
function addAccessibilityToButton(button) {
    if (!button) return;
    
    // Add ARIA attributes for better screen reader support
    if (!button.hasAttribute('aria-label')) {
        const textContent = button.textContent.trim();
        if (textContent) {
            button.setAttribute('aria-label', textContent);
        }
    }
    
    // Ensure button has proper focus management
    button.setAttribute('tabindex', '0');
    
    // Add keyboard event support if not present
    if (!button.hasAttribute('data-accessible-added')) {
        button.addEventListener('keydown', function(e) {
            // Space and Enter keys should activate the button
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                button.click();
            }
        });
        button.setAttribute('data-accessible-added', 'true');
    }
}

/**
 * Adds accessibility features to image elements
 * @param {HTMLImageElement} image - The image element to enhance
 */
function addAccessibilityToImage(image) {
    if (!image) return;
    
    // Ensure alt text exists
    if (!image.hasAttribute('alt') || !image.getAttribute('alt').trim()) {
        image.setAttribute('alt', '');
    }
}

/**
 * Adds accessibility features to form inputs
 * @param {HTMLInputElement} input - The input element to enhance
 */
function addAccessibilityToInput(input) {
    if (!input) return;
    
    // Ensure label association
    const id = input.getAttribute('id');
    if (id) {
        const label = document.querySelector(`label[for="${id}"]`);
        if (!label) {
            // Create a label if none exists
            const newLabel = document.createElement('label');
            newLabel.setAttribute('for', id);
            newLabel.textContent = input.getAttribute('aria-label') || 'Input field';
            input.parentNode.insertBefore(newLabel, input);
        }
    }
    
    // Add ARIA describedby for error messages if they exist
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        const errorId = 'error-' + Math.random().toString(36).substr(2, 9);
        errorMessage.setAttribute('id', errorId);
        input.setAttribute('aria-describedby', errorId);
        input.setAttribute('aria-invalid', 'true');
    }
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addAccessibilityToButton,
        addAccessibilityToImage,
        addAccessibilityToInput
    };
}

// Initialize accessibility enhancements when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Apply accessibility enhancements to all buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(addAccessibilityToButton);
        
        // Apply accessibility enhancements to all images
        const images = document.querySelectorAll('img');
        images.forEach(addAccessibilityToImage);
        
        // Apply accessibility enhancements to all inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(addAccessibilityToInput);
    });
}

// Placeholder for additional accessibility-related code changes
// Future accessibility enhancements can be added here