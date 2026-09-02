// TODO: This is the existing code that needs to be preserved (This comment remains as-is)
// Main entry point for dependency visualization tool
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// [PLACE ALL EXISTING FUNCTIONS, VARIABLES, AND EXPORTS HERE]

// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// TODO: Implement spawning logic
function spawnEntity(entityType, position, properties = {}) {
  // Validate required parameters
  if (!entityType || typeof entityType !== 'string') {
    throw new Error('Entity type must be a non-empty string');
  }

  if (!position || typeof position !== 'object' ||
      typeof position.x !== 'number' || typeof position.y !== 'number') {
    throw new Error('Position must be an object with x and y coordinates');
  }

  // Create a new entity object with default properties
  const entity = {
    type: entityType,
    position: { ...position },
    health: properties.health || 100,
    speed: properties.speed || 1,
    createdAt: new Date(),
    ...properties
  };

  // Additional initialization based on entity type
  switch (entityType) {
    case 'player':
      entity.inventory = properties.inventory || [];
      entity.score = properties.score || 0;
      break;
    case 'enemy':
      entity.aggression = properties.aggression || 50;
      entity.damage = properties.damage || 10;
      break;
    case 'npc':
      entity.dialogue = properties.dialogue || [];
      break;
    default:
      // For custom entity types, merge any additional properties
      Object.assign(entity, properties);
  }

  return entity;
}

// TODO: Implement calculateDiscount
function calculateDiscount(originalPrice, discountPercentage) {
  const discountAmount = originalPrice * (discountPercentage / 100);
  return originalPrice - discountAmount;
}

// Example of adding a new function
function newFunction() {
  // Function body
}

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/lang=/i.test(attrs)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table([^>]*)>)/gi, (match, tableTag, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `${tableTag}<caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/(<table[^>]*>)([\s\S]*?)(<\/table>)/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<th[^>]*>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead><tr>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</tr></thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope=/i.test(attrs)) return match;
        return `<th${attrs} scope="col">`;
    });

    return html;
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers');
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }

  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main/i.test(html) && /<body/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav/i.test(html) && /<main/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside/i.test(html) && /<\/main>/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Complementary content"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer/i.test(html) && /<\/body>/i.test(html)) {
        html = html.replace(
            /<\/body>/i,
            '<footer></footer></body>'
        );
    }

    return html;
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames(html) {
    if (typeof html !== 'string') return html;

    const svgMatches = html.match(/<svg[^>]*>/gi);
    let offset = 0;

    svgMatches && svgMatches.forEach((match, index) => {
        const fullMatch = match;
        const attrs = match;
        const svgStart = html.indexOf(match) + offset;
        const svgEnd = html.indexOf('</svg>', svgStart);

        if (svgEnd === -1) return;

        const svgContent = html.substring(svgStart, svgEnd + 6);
        const hasTitle = /<title/i.test(svgContent);
        const hasAriaLabel = /\baria-label=/i.test(attrs);
        const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs);

        if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
            const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`);
            const oldSvgLength = svgContent.length;
            html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength);
            offset += newSvg.length - oldSvgLength;
        }
    });

    return html;
}

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = typeof document !== 'undefined' ? document.querySelectorAll('a') : [];
  const issues = [];

  links.forEach(link => {
    const href = link.getAttribute('href') || '';
    const text = link.textContent.trim();

    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`);
    }

    // Check for aria-label or aria-labelledby if link has no text
    if (!text && !link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
      issues.push(`Link with href "${href}" has no accessible name (missing text, aria-label, or aria-labelledby)`);
    }

    // Check if link is decorative but not marked as such
    if (href === '#' && !link.getAttribute('aria-hidden') && link.getAttribute('role') !== 'presentation') {
      issues.push(`Decorative link with href="#" should have aria-hidden="true" or role="presentation"`);
    }
  });

  return issues;
}

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch) - preserved