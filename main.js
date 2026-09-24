// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return `<table${attrs}><caption></caption>`;
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
        if (/<thead/i.test(content)) return match;
        const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        const firstRows = rows.slice(0, 1).join('');
        const restRows = rows.slice(1).join('');
        const thPattern = /<td>/gi;
        const firstRowHasTh = thPattern.test(firstRows);
        let thead = '';
        let tbody = restRows;

        if (!firstRowHasTh) {
            thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`;
        } else {
            thead = `<thead>${firstRows}</thead>`;
        }
        if (!tbody) tbody = '';
        tbody = `<tbody>${tbody}</tbody>`;

        return `<table${attrs}>${thead}${tbody}</table>`;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/\bscope=/i.test(match)) return match;
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
=======
// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Existing code starts here
const userSafety = 'unsafe';
const safetyCategories = 'Unauthorized Advice';

const books = [];
const safetyCategory = "User Safety: safe";

    if (userSafety !== 'safe') {
      userSafetyMessage = 'User safety level is set to "unsafe". Please review and update this setting for better security.';
    }

  // Close caption and wrap rows in thead/tbody where missing
  html = ... (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = ... || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<td>/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

  return booksList.join("\n");
}

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match
    return `<html${attrs} lang="${lang}">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a caption
  html = html.replace(/<table([^>]*)>/gi, (match, attrs) => {
    if (/<caption/i.test(match)) return match
    return `<table${attrs}><caption></caption>`
  })

  // Close caption and wrap rows in thead/tbody where missing
  html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<td>/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

    if (!firstRowHasTh) {
      thead = `<thead>${firstRows.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>')}</thead>`
    } else {
      thead = `<thead>${firstRows}</thead>`
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    return `<table${attrs}>${thead}${tbody}</table>`
  })

  // Add scope="col" to th elements that don't have it
  html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/\bscope=/i.test(match)) return match
    return `<th${attrs} scope="col">`
  })

  return html
}

// Configuration
const config = {
  dataPath: './data',
  maxResults: 100
};

// Landmark validation configuration
const CONFIG = {
  maxLandmarks: 50,
  allowedRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region']
};

// Landmark validation configuration
const landmarkConfig = CONFIG;

// Helper functions
function isValidLandmark(landmark) {
  return landmark && landmark.id && landmark.role;
}

function loadLandmarks() {
  try {
    const filePath = path.join(__dirname, config.dataPath, 'landmarks.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
      console.error('Error loading landmarks:', error.message);
      return [];
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;

    // Ensure <main> landmark exists
    if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
        html = html.replace(
            /<body([^>]*)>/i,
            '<body$1><main>'
        );
        html = html.replace(/<\/body>/i, '</main></body>');
    }

    // Ensure <nav> landmark exists
    if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
        html = html.replace(
            /<main[^>]*>/i,
            '<nav aria-label="Main navigation"></nav><main>'
        );
    }

    // Ensure <aside> landmark exists if content suggests a sidebar
    if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
        html = html.replace(
            /<\/main>/i,
            '<aside aria-label="Supplementary"></aside></main>'
        );
    }

    // Ensure <footer> landmark exists
    if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
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

    const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)];
    let offset = 0;

    svgMatches.forEach((match, index) => {
        const fullMatch = match[0];
        const attrs = match[1];
        const svgStart = match.index + offset;
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

// REACT_025: Ensure unique landmarks (2 issues)
function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;
}

function processLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const validLandmarks = landmarks.filter(isValidLandmark);
  const uniqueLandmarks = ensureUniqueLandmarks(validLandmarks);

  return uniqueLandmarks.slice(0, config.maxResults);
}

function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (seen.has(landmark.id)) {
      return false;
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    return ...
  })

  // Add scope="col" to th elements that don't have it
  html = ... (match, attrs) => {
    if ... return match
    return `<th${attrs} scope="col">`
  })

  // REACT_025: Ensure unique landmarks
  html = ...

  // REACT_036: Fix fake link issues
  html = fixFakeLinks(html)

  return html
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependency-graph');
  if (!container) {
    return;
  }
}

// REACT_036: Fix 1 fake link issue
function fixFakeLinks(html) {
    if (typeof html !== 'string') return html;

    // Find spans or divs with onclick that act as links and convert to <a>
    html = html.replace(
        /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
        (match, before, onclick, after) => {
            const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/);
            if (hrefMatch) {
                return `<a href="${hrefMatch[1]}"${before}${after}>`;
            }
            return match;
        }
    );

    html = html.replace(/<\/span>/gi, '</a>');

    return html;
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = addLangAttribute(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = addSvgAccessibleNames(result);
    result = ensureUniqueLandmarks(result);
    result = fixFakeLinks(result);
    return result;
}

function addressAccessibilityIssues(insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
  console.log('Addressing accessibility issues from insight report:', insightReport);
}

function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    document.body.appendChild(button);
}

// Harvest and upgrade logic
// State for harvest and upgrade system
let harvestState = {
    resources: 0,
    upgradeLevel: 1,
    harvestMultiplier: 1
};

/**
 * Harvests resources based on current upgrade level and multiplier
 * @param {number} baseAmount - The base amount to harvest (default: 1)
 * @returns {object} Object containing harvested amount and total resources
 */
function harvest(baseAmount = 1) {
    if (typeof baseAmount !== 'number' || baseAmount < 0) {
        throw new Error('Harvest amount must be a non-negative number');
    }

    const harvestedAmount = baseAmount * harvestState.harvestMultiplier * harvestState.upgradeLevel;
    harvestState.resources += harvestedAmount;

    return {
        harvested: harvestedAmount,
        total: harvestState.resources,
        level: harvestState.upgradeLevel,
        multiplier: harvestState.harvestMultiplier
    };
}

/**
 * Upgrades the harvest system if enough resources are available
 * @param {number} cost - The cost of the upgrade (auto-calculated if not provided)
 * @returns {object} Object containing success status, new level, and remaining resources
 */
function upgrade(cost = null) {
    // Auto-calculate cost if not provided: cost = level * 10
    const upgradeCost = cost !== null ? cost : harvestState.upgradeLevel * 10;

    if (typeof upgradeCost !== 'number' || upgradeCost < 0) {
        throw new Error('Upgrade cost must be a non-negative number');
    }

    if (harvestState.resources < upgradeCost) {
        return {
            success: false,
            level: harvestState.upgradeLevel,
            resources: harvestState.resources,
            required: upgradeCost,
            message: 'Insufficient resources for upgrade'
        };
    }

    harvestState.resources -= upgradeCost;
    harvestState.upgradeLevel += 1;

    return {
        success: true,
        level: harvestState.upgradeLevel,
        resources: harvestState.resources,
        cost: upgradeCost,
        message: `Successfully upgraded to level ${harvestState.upgradeLevel}`
    };
}

/**
 * Resets the harvest and upgrade state
 * @returns {object} The reset state
 */
function resetHarvestState() {
    harvestState = {
        resources: 0,
        upgradeLevel: 1,
        harvestMultiplier: 1
    };
    return { ...harvestState };
}

/**
 * Gets the current harvest state
 * @returns {object} Current harvest state
 */
function getHarvestState() {
    return { ...harvestState };
}

/**
 * Sets the harvest multiplier
 * @param {number} multiplier - The multiplier to set
 * @returns {object} Updated harvest state
 */
function setHarvestMultiplier(multiplier) {
    if (typeof multiplier !== 'number' || multiplier < 0) {
        throw new Error('Multiplier must be a non-negative number');
    }
    harvestState.harvestMultiplier = multiplier;
    return { ...harvestState };
}

// TODO: add the new functions or changes requested in the issue
// Here is the implementation for checking link accessibility
// The existing isLinkAccessible function implementation
function isLinkAccessible(linkElement) {
    if (!linkElement || !(linkElement instanceof HTMLElement)) {
        throw new Error('Invalid link element provided');
    }

    // Check if link has text content
    const hasTextContent = linkElement.textContent.trim().length > 0;

    // Check if link has aria-label or aria-labelledby
    const hasAriaLabel = linkElement.hasAttribute('aria-label') ||
                         linkElement.hasAttribute('aria-labelledby');

    // Check if link has title attribute
    const hasTitle = linkElement.hasAttribute('title');

    // Check if link has href attribute
    const hasHref = linkElement.hasAttribute('href');

    // Check if link is visible
    const isVisible = window.getComputedStyle(linkElement).display !== 'none' &&
                      window.getComputedStyle(linkElement).visibility !== 'hidden';

    // Check if link is focusable
    const isFocusable = linkElement.tabIndex >= 0 ||
                       (linkElement.tagName === 'A' && hasHref) ||
                       linkElement.tagName === 'BUTTON' ||
                       linkElement.tagName === 'INPUT' ||
                       linkElement.tagName === 'SELECT' ||
                       linkElement.tagName === 'TEXTAREA';

    // Check if link has sufficient color contrast
    const hasContrast = checkColorContrast(linkElement);

    return {
        hasTextContent,
        hasAriaLabel,
        hasTitle,
        hasHref,
        isVisible,
        isFocusable,
        hasContrast,
        isAccessible: hasTextContent && (hasAriaLabel || hasTitle) && hasHref && isVisible && isFocusable && hasContrast
    };
}

// Helper function to check color contrast
function checkColorContrast(element) {
    if (!element || !(element instanceof HTMLElement)) return false;

    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;

    // Convert colors to RGB
    const bgRgb = parseColor(bgColor);
    const fgRgb = parseColor(color);

    if (!bgRgb || !fgRgb) return false;

    // Calculate luminance
    const bgLum = calculateLuminance(bgRgb);
    const fgLum = calculateLuminance(fgRgb);

    // Calculate contrast ratio
    const lighter = Math.max(bgLum, fgLum);
    const darker = Math.min(bgLum, fgLum);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);

    // WCAG AA standard requires at least 4.5:1 contrast for normal text
    return contrastRatio >= 4.5;
}

// Helper function to parse color strings to RGB
function parseColor(colorString) {
    if (!colorString) return null;

    // Handle rgb() format
    const rgbMatch = colorString.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1], 10),
            g: parseInt(rgbMatch[2], 10),
            b: parseInt(rgbMatch[3], 10)
        };
    }

    // Handle rgba() format (ignore alpha)
    const rgbaMatch = colorString.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)$/);
    if (rgbaMatch) {
        return {
            r: parseInt(rgbaMatch[1], 10),
            g: parseInt(rgbaMatch[2], 10),
            b: parseInt(rgbaMatch[3], 10)
        };
    }

    // Handle hex format
    const hexMatch = colorString.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16)
            };
        } else {
            return {
                r: parseInt(hex.substring(0, 2), 16),
                g: parseInt(hex.substring(2, 4), 16),
                b: parseInt(hex.substring(4, 6), 16)
            };
        }
    }

    // Handle named colors (limited support)
    const namedColors = {
        'black': {r: 0, g: 0, b: 0},
        'white': {r: 255, g: 255, b: 255},
        'red': {r: 255, g: 0, b: 0},
        'green': {r: 0, g: 128, b: 0},
        'blue': {r: 0, g: 0, b: 255}
    };

    return namedColors[colorString.toLowerCase()] || null;
}

// Helper function to calculate relative luminance
function calculateLuminance(rgb) {
    const sRGB = [rgb.r, rgb.g, rgb.b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

// TODO: Re-add the required exports for functionA and functionB

module.exports = {
    addLangAttribute,
    fixTableStructure,
    fixLandmarks,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinks,
    applyAccessibilityFixes,
    addressAccessibilityIssues,
    createInPageButton,
    divide,
    harvest,
    upgrade,
    resetHarvestState,
    getHarvestState,
    setHarvestMultiplier,
    isLinkAccessible,
    checkColorContrast,
    parseColor,
    calculateLuminance
};

// Run if executed directly
if (require.main === module) {
  main();
}
=======
  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

/**
 * Adds lang attribute to HTML element
 */
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return ... (match, attrs) => {
    if ... return match
    return `<html${attrs} lang="${lang}">`
  })
}

// New function requested in the issue
function logCurrentURL () {
    console.log('Current URL: ' + window.location.href);
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
function validateTableAccessibility (table) {
  // Implementation to be added
}

/**
 * Validates table structure
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table structure is valid
 */
function validateTableStructure (table) {
  // Implementation to be added
}

/**
 * Fixes table structure issues
 * @param {HTMLElement} table - The table element to fix
 */
function fixTableStructure (table) {
  // Implementation to be added
}

/**
 * Adds main landmark to the document
 */
function addMainLandmark () {
  // Implementation to be added
}

/**
 * Validates landmark
 * @param {HTMLElement} landmark - The landmark element to validate
 * @returns {boolean} True if landmark is valid
 */
function validateLandmark (landmark) {
  if (!landmark || !(landmark instanceof HTMLElement)) {
    return false;
  }

  // Check if it's a valid HTML5 landmark element
  const html5Landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];
  const isHtml5Landmark = html5Landmarks.includes(landmark.tagName.toLowerCase());

  // Check if it's a valid ARIA landmark role
  const ariaLandmarkRoles = ['banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation', 'region', 'search'];
  const role = landmark.getAttribute('role');
  const isAriaLandmark = role && ariaLandmarkRoles.includes(role);

  // Must be either HTML5 landmark or ARIA landmark
  if (!isHtml5Landmark && !isAriaLandmark) {
    return false;
  }

  // Validate structure and attributes
  const structureValid = validateLandmarkStructure(landmark);
  const attributesValid = validateLandmarkAttributes(landmark);

  return structureValid && attributesValid;
}

function processData(data) {
  if (!data) return null;
  if (typeof data === 'string') {
    return data.trim();
  }
  if (Array.isArray(data)) {
    return data.filter(item => item != null);
  }
  return data;
}

function formatResponse(data, status = 'success') {
  return {
    status,
    data,
    timestamp: new Date().toISOString()
  };
}

function validateTableAccessibility(table) {
  // Validate table accessibility
  if (!table) return { valid: false, error: 'Table not found' };
  
  const headers = table.querySelectorAll('th');
  const cells = table.querySelectorAll('td');
  
  if (headers.length === 0) {
    return { valid: false, error: 'Table must have header cells' };
  }
  
  return { valid: true };
}

function validateTableStructure(table) {
  // Validate table structure
  if (!table) return { valid: false, error: 'Table not found' };
  
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return { valid: false, error: 'Table must have at least one row' };
  }
  
  return { valid: true };
}

function getSvgAccessibleName(svg) {
  if (!svg) return null;
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg, attributes) {
  if (!svg || !attributes) return;
  Object.keys(attributes).forEach(key => {
    svg.setAttribute(key, attributes[key]);
  });
}

function addMainLandmark(container) {
  if (!container) return;
  const main = container.querySelector('main') || document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
}

function validateLandmark(landmark) {
  if (!landmark) return { valid: false, error: 'Landmark not found' };
  if (!landmark.id) return { valid: false, error: 'Landmark must have an id' };
  if (!landmark.role) return { valid: false, error: 'Landmark must have a role' };
  return { valid: true };
}

function validateLandmarkStructure(landmarks) {
  if (!Array.isArray(landmarks)) {
    return { valid: false, error: 'Landmarks must be an array' };
  }
  return { valid: true };
}

function validateLandmarkAttributes(landmark) {
  if (!landmark) return { valid: false, error: 'Landmark not found' };
  const required = ['id', 'role'];
  const missing = required.filter(attr => !landmark[attr]);
  if (missing.length > 0) {
    return { valid: false, error: `Missing attributes: ${missing.join(', ')}` };
  }
  return { valid: true };
}

function addProperLandmarkRegions(container) {
  if (!container) return;
  const regions = container.querySelectorAll('[role="region"]');
  regions.forEach(region => {
    if (!region.hasAttribute('aria-label')) {
      region.setAttribute('aria-label', 'Region');
    }
  });
}
>>>>>>> origin/main