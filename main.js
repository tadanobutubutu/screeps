// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// Commit: 79bba944f656d0547ab90f80c463fa57891b9be7

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html, lang = 'en') {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/lang=["']/.test(attrs)) return match
    return `<html${attrs} lang="${lang}">`
  })
}

function addLangAttribute() {
  // Implementation for adding lang attribute
}

function fixTableStructure() {
  // Implementation for fixing table structure issues
}

function fixLandmarks() {
  // Implementation for fixing landmark issues
}

function addSvgAccessibleNames() {
  // Implementation for adding accessible names to SVGs
}

function ensureUniqueLandmarks() {
  // Implementation for ensuring unique landmarks
}

function fixFakeLinks() {
  // Implementation for fixing fake link issues
}

function applyAccessibilityFixes() {
  // Implementation for applying accessibility fixes
}

function addressAccessibilityIssues() {
  // Implementation for addressing accessibility issues
}

function createInPageButton() {
  // Implementation for creating in-page button
}

function validateTableAccessibility() {
  // Implementation for validating table accessibility
}

function validateLandmarkStructure() {
  // Implementation for validating landmark structure
}

function getLangAttribute() {
  // Implementation for getting lang attribute
}

function getSvgAccessibleName() {
  // Implementation for getting SVG accessible name
}

function personName() {
  // Implementation for person name
}

function checkLinkAccessibility() {
  // Implementation for checking link accessibility
}

function wrapPrimaryContentInMain() {
  // Implementation for wrapping primary content in main
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks (html) {
  if (typeof html !== 'string') return html

  const landmarkRoles = [
    'banner',
    'navigation',
    'main',
    'complementary',
    'contentinfo',
    'search',
    'form'
  ]

  landmarkRoles.forEach((role) => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first occurrence, change subsequent ones
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return 'role="region"'
      })
    }
  })

  // Also check for duplicate HTML5 landmark elements (header, nav, main, aside, footer)
  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer']
  html5Landmarks.forEach((tag) => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      // Keep first, add role="region" to others
      let count = 0
      html = html.replace(pattern, (match) => {
        count++
        if (count === 1) return match
        return match.replace(new RegExp(`<${tag}`, 'i'), `<${tag} role="region"`)
      })
    }
  })

  return html
}

// REACT_036: Fix fake link issues
function fixFakeLinks (html) {
  if (typeof html !== 'string') return html

  // Find spans or divs with onclick that act as links and convert to <a>
  html = html.replace(
    /<span([^>]*)onclick=["']([^"']*)["']([^>]*)>/gi,
    (match, before, onclick, after) => {
      const hrefMatch = onclick.match(/window\.location\s*=\s*['"]([^'"]+)['"]/)
      if (hrefMatch) {
        return `<a href="${hrefMatch[1]}"${before}${after}>`
      }
      return match
    }
  )

  html = html.replace(/<\/span>/gi, '</a>')

  return html
}

// NEW: Validate table accessibility
function validateTableAccessibility(html) {
    if (typeof html !== 'string') return true;

    // Check for tables without captions
    const tablesWithoutCaptions = html.match(/<table[^>]*>(?!.*<caption[^>]*>)/gi);
    if (tablesWithoutCaptions) {
        console.warn(`Found ${tablesWithoutCaptions.length} tables without captions`);
        return false;
    }

    // Check for tables without thead/tbody
    const tablesWithoutStructure = html.match(/<table[^>]*>(?!.*<thead[^>]*>)(?!.*<tbody[^>]*>)/gi);
    if (tablesWithoutStructure) {
        console.warn(`Found ${tablesWithoutStructure.length} tables without proper structure`);
        return false;
    }

    return true;
}

// NEW: Validate landmark structure
function validateLandmarkStructure(html) {
    if (typeof html !== 'string') return true;

    const requiredLandmarks = ['main', 'nav', 'footer'];
    let isValid = true;

    requiredLandmarks.forEach(landmark => {
        const pattern = new RegExp(`<${landmark}[^>]*>|<div[^>]*role=["']${landmark}["']`, 'i');
        if (!pattern.test(html)) {
            console.warn(`Missing required landmark: ${landmark}`);
            isValid = false;
        }
    });

    return isValid;
}

// NEW: Get language attribute for HTML element
function getLangAttribute(html) {
    if (typeof html !== 'string') return 'en';

    const match = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
    return match ? match[1] : 'en';
}

// NEW: Get accessible name for SVG
function getSvgAccessibleName(svgElement) {
    if (!svgElement) return 'SVG';

    if (svgElement.hasAttribute('aria-label')) {
        return svgElement.getAttribute('aria-label');
    }

    if (svgElement.hasAttribute('aria-labelledby')) {
        const id = svgElement.getAttribute('aria-labelledby');
        const labelElement = document.getElementById(id);
        return labelElement ? labelElement.textContent : 'SVG';
    }

    const title = svgElement.querySelector('title');
    return title ? title.textContent : 'SVG';
}

// NEW: Person name utility
function personName(name) {
    if (!name) return '';

    // Simple name formatting - can be enhanced as needed
    return name.trim()
        .replace(/\s+/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2');
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes (html) {
  let result = html
  result = addLangAttribute(result)
  result = fixTableStructure(result)
  result = fixLandmarks(result)
  result = addSvgAccessibleNames(result)
  result = ensureUniqueLandmarks(result)
  result = fixFakeLinks(result)
  return result
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

// TODO: Implement renderIndexView functionality
/**
 * Renders an index view with navigation items for accessibility testing interface.
 * Creates a main container with a header and list of navigation buttons.
 * @param {Array<Object>} items - Array of items to render, each with id, text, and optional href
 * @param {string} items[].id - Unique identifier for the item
 * @param {string} items[].text - Display text for the item
 * @param {string} [items[].href] - Optional href for link-based items
 * @param {string} [title='Index'] - Title for the index view
 * @returns {HTMLElement} The rendered index view container element
 */
function renderIndexView(items = [], title = 'Index') {
    // Create main container
    const container = document.createElement('div');
    container.id = 'index-view';
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', title);

    // Create header
    const header = document.createElement('header');
    const heading = document.createElement('h1');
    heading.textContent = title;
    heading.id = 'index-heading';
    header.appendChild(heading);

    // Ensure header has proper landmark role
    if (!header.hasAttribute('role')) {
        header.setAttribute('role', 'banner');
    }

    container.appendChild(header);

    // Create navigation section
    const nav = document.createElement('nav');
    nav.setAttribute('aria-labelledby', 'index-heading');

    // Create list of items
    const list = document.createElement('ul');
    list.setAttribute('role', 'list');

    items.forEach((item) => {
        const listItem = document.createElement('li');
        
        if (item.href) {
            // Create link element for items with href
            const link = document.createElement('a');
            link.id = item.id;
            link.href = item.href;
            link.textContent = item.text;
            link.setAttribute('role', 'menuitem');
            listItem.appendChild(link);
        } else {
            // Create button for items without href, using existing createInPageButton pattern
            const button = document.createElement('button');
            button.id = item.id;
            button.textContent = item.text;
            button.setAttribute('role', 'menuitem');
            
            if (item.className) {
                button.className = item.className;
            }
            
            listItem.appendChild(button);
        }
        
        list.appendChild(listItem);
    });

    nav.appendChild(list);
    container.appendChild(nav);

    // Create main content area
    const main = document.createElement('main');
    main.id = 'index-content';
    main.setAttribute('role', 'main');
    container.appendChild(main);

    // Create footer
    const footer = document.createElement('footer');
    footer.setAttribute('role', 'contentinfo');
    const footerText = document.createElement('p');
    footerText.textContent = 'Accessibility Test Index';
    footer.appendChild(footerText);
    container.appendChild(footer);

    return container;
}

// Don't forget to test your new additions in the test file

// Export accessibility utility functions
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
  renderIndexView,
  validateTableAccessibility,
  validateLandmarkStructure,
  getLangAttribute,
  getSvgAccessibleName,
  personName,
  divide,
  checkLinkAccessibility,
  wrapPrimaryContentInMain,
  renderDependencyGraph
}

// Run if executed directly
if (require.main === module) {
  main()
}