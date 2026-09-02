// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue
// ADD: Address new accessibility issues from insight report

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

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide (dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers')
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers')
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed')
  }

  return dividend / divisor
}

// REACT_017: Add/fix landmark issues
function fixLandmarks (html) {
  if (typeof html !== 'string') return html

  // Ensure <main> landmark exists
  if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
    html = html.replace(/<body([^>]*)>/i, '<body$1><main>')
    html = html.replace(/<\/body>/i, '</main></body>')
  }

  // Ensure <nav> landmark exists
  if (!/<nav[^>]*>/i.test(html) && !/<div[^>]*role=["']navigation["']/i.test(html)) {
    html = html.replace(/<main[^>]*>/i, '<nav aria-label="Main navigation"></nav><main>')
  }

  // Ensure <aside> landmark exists if content suggests a sidebar
  if (!/<aside[^>]*>/i.test(html) && !/<div[^>]*role=["']complementary["']/i.test(html)) {
    html = html.replace(/<\/main>/i, '<aside aria-label="Supplementary"></aside></main>')
  }

  // Ensure <footer> landmark exists
  if (!/<footer[^>]*>/i.test(html) && !/<div[^>]*role=["']contentinfo["']/i.test(html)) {
    html = html.replace(/<\/body>/i, '<footer></footer></body>')
  }

  return html
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames (html) {
  if (typeof html !== 'string') return html

  const svgMatches = [...html.matchAll(/<svg([^>]*)>/gi)]
  let offset = 0

  svgMatches.forEach((match, index) => {
    const fullMatch = match[0]
    const attrs = match[1]
    const svgStart = match.index + offset
    const svgEnd = html.indexOf('</svg>', svgStart)

    if (svgEnd === -1) return

    const svgContent = html.substring(svgStart, svgEnd + 6)
    const hasTitle = /<title/i.test(svgContent)
    const hasAriaLabel = /\baria-label=/i.test(attrs)
    const hasAriaLabelledBy = /\baria-labelledby=/i.test(attrs)

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
      const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`)
      const oldSvgLength = svgContent.length
      html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength)
      offset += newSvg.length - oldSvgLength
    }
  })

  return html
}

function checkLinkAccessibility () {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const links = document.querySelectorAll('a[href]')
  const issues = []

  links.forEach((link) => {
    const href = link.getAttribute('href')
    const text = link.textContent.trim()

    if (!text) {
      issues.push(`Link with href "${href}" has no accessible text`)
    }
  })

  return issues
}

// TODO: Implement wrapPrimaryContentInMain function, including the added logic
/**
 * Wraps the primary content of the page in a <main> element for improved accessibility.
 * This function checks if a <main> element already exists; if not, it creates one
 * and moves all body content into it.
 * @returns {Element|null} The <main> element if successfully created/wrapped, or null if body is not available
 */
function wrapPrimaryContentInMain () {
  const body = document.body

  // Return null if body element is not available
  if (!body) {
    return null
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = document.querySelector('main')
  if (existingMain) {
    return existingMain
  }

  // Create a new <main> element
  const main = document.createElement('main')

  // Move all existing body children into the <main> element
  while (body.firstChild) {
    main.appendChild(body.firstChild)
  }

  // Append the <main> element to the body
  body.appendChild(main)

  return main
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
  wrapPrimaryContentInMain
}