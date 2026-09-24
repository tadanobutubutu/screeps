function addMissingExport() {
  // This function performs the missing export not mentioned in the existing code
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

// TODO: Implement function for generating a report based on accessibility issues
/**
 * Generates a report based on accessibility issues found in HTML content
 * @param {string} html - The HTML content to analyze
 * @returns {Object} A report object containing all accessibility issues found
 */
function generateAccessibilityReport (html) {
  const report = {
    issues: [],
    summary: {
      total: 0,
      langAttribute: 0,
      tableStructure: 0,
      landmarks: 0,
      svgAccessibleNames: 0,
      uniqueLandmarks: 0,
      fakeLinks: 0,
      linkAccessibility: 0
    }
  }

  if (typeof html !== 'string') {
    return report
  }

  // Check for lang attribute on <html> (REACT_015)
  if (!/<html[^>]*\blang=/i.test(html)) {
    report.issues.push({
      type: 'REACT_015',
      description: 'Missing lang attribute on <html> element',
      severity: 'critical',
      element: '<html>'
    })
    report.summary.langAttribute++
    report.summary.total++
  }

  // Check for table structure issues (REACT_027)
  const tableMatches = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || []
  tableMatches.forEach((table, index) => {
    if (!/<caption/i.test(table)) {
      report.issues.push({
        type: 'REACT_027',
        description: `Table ${index + 1} missing <caption> element`,
        severity: 'warning',
        element: '<table>'
      })
      report.summary.tableStructure++
      report.summary.total++
    }

    if (!/<thead/i.test(table)) {
      report.issues.push({
        type: 'REACT_027',
        description: `Table ${index + 1} missing <thead> element`,
        severity: 'warning',
        element: '<table>'
      })
      report.summary.tableStructure++
      report.summary.total++
    }

    if (!/<tbody/i.test(table)) {
      report.issues.push({
        type: 'REACT_027',
        description: `Table ${index + 1} missing <tbody> element`,
        severity: 'warning',
        element: '<table>'
      })
      report.summary.tableStructure++
      report.summary.total++
    }

    // Check for th elements without scope attribute
    const thMatches = table.match(/<th([^>]*)>/gi) || []
    thMatches.forEach((th) => {
      if (!/\bscope=/i.test(th)) {
        report.issues.push({
          type: 'REACT_027',
          description: 'Table header cell missing scope attribute',
          severity: 'warning',
          element: '<th>'
        })
        report.summary.tableStructure++
        report.summary.total++
      }
    })
  })

  // Check for landmark issues (REACT_017)
  const hasMain = /<main[^>]*>/i.test(html) || /<div[^>]*role=["']main["']/i.test(html)
  const hasNav = /<nav[^>]*>/i.test(html) || /<div[^>]*role=["']navigation["']/i.test(html)
  const hasAside = /<aside[^>]*>/i.test(html) || /<div[^>]*role=["']complementary["']/i.test(html)
  const hasFooter = /<footer[^>]*>/i.test(html) || /<div[^>]*role=["']contentinfo["']/i.test(html)

  if (!hasMain) {
    report.issues.push({
      type: 'REACT_017',
      description: 'Missing <main> landmark',
      severity: 'critical',
      element: '<main>'
    })
    report.summary.landmarks++
    report.summary.total++
  }

  if (!hasNav) {
    report.issues.push({
      type: 'REACT_017',
      description: 'Missing <nav> landmark',
      severity: 'warning',
      element: '<nav>'
    })
    report.summary.landmarks++
    report.summary.total++
  }

  if (!hasAside) {
    report.issues.push({
      type: 'REACT_017',
      description: 'Missing <aside> landmark (supplementary content)',
      severity: 'info',
      element: '<aside>'
    })
    report.summary.landmarks++
    report.summary.total++
  }

  if (!hasFooter) {
    report.issues.push({
      type: 'REACT_017',
      description: 'Missing <footer> landmark',
      severity: 'warning',
      element: '<footer>'
    })
    report.summary.landmarks++
    report.summary.total++
  }

  // Check for SVG accessibility issues (REACT_041)
  const svgMatches = html.match(/<svg([^>]*)>[\s\S]*?<\/svg>/gi) || []
  svgMatches.forEach((svg, index) => {
    const hasTitle = /<title/i.test(svg)
    const hasAriaLabel = /\baria-label=/i.test(svg)
    const hasAriaLabelledBy = /\baria-labelledby=/i.test(svg)

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
      report.issues.push({
        type: 'REACT_041',
        description: `SVG ${index + 1} missing accessible name (title, aria-label, or aria-labelledby)`,
        severity: 'warning',
        element: '<svg>'
      })
      report.summary.svgAccessibleNames++
      report.summary.total++
    }
  })

  // Check for unique landmark issues (REACT_025)
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form']
  landmarkRoles.forEach((role) => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      report.issues.push({
        type: 'REACT_025',
        description: `Duplicate ${role} landmark role found (${matches.length} instances)`,
        severity: 'warning',
        element: `[role="${role}"]`
      })
      report.summary.uniqueLandmarks++
      report.summary.total++
    }
  })

  // Check for duplicate HTML5 landmark elements
  const html5Landmarks = ['header', 'nav', 'main', 'aside', 'footer']
  html5Landmarks.forEach((tag) => {
    const pattern = new RegExp(`<${tag}[^>]*>`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      report.issues.push({
        type: 'REACT_025',
        description: `Duplicate <${tag}> landmark element found (${matches.length} instances)`,
        severity: 'warning',
        element: `<${tag}>`
      })
      report.summary.uniqueLandmarks++
      report.summary.total++
    }
  })

  // Check for fake link issues (REACT_036)
  const fakeLinkPattern = /<span([^>]*)onclick=["']([^"']*window\.location[^"']*)["']([^>]*)>/gi
  let fakeLinkMatch
  while ((fakeLinkMatch = fakeLinkPattern.exec(html)) !== null) {
    report.issues.push({
      type: 'REACT_036',
      description: 'Fake link detected (span/div with onclick window.location)',
      severity: 'critical',
      element: '<span onclick="...">'
    })
    report.summary.fakeLinks++
    report.summary.total++
  }

  // Check for link accessibility issues
  const linkPattern = /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi
  let linkMatch
  while ((linkMatch = linkPattern.exec(html)) !== null) {
    const linkText = (linkMatch[2] || '').replace(/<[^>]*>/g, '').trim()
    if (!linkText) {
      report.issues.push({
        type: 'REACT_017',
        description: `Link with href="${linkMatch[1]}" has no accessible text`,
        severity: 'warning',
        element: '<a>'
      })
      report.summary.linkAccessibility++
      report.summary.total++
    }
  }

  return report
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

/**
 * Generates an accessibility report based on HTML content.
 * Scans for common accessibility issues and returns a structured report.
 * @param {string} html - The HTML content to analyze for accessibility issues
 * @param {Object} options - Optional configuration for the report
 * @param {string} options.url - The URL of the page being analyzed
 * @param {string} options.pageTitle - The title of the page being analyzed
 * @returns {Object} A structured accessibility report with violations and summary
 */
function generateAccessibilityReport (html, options = {}) {
  const violations = []

  if (typeof html !== 'string') {
    return {
      timestamp: new Date().toISOString(),
      url: options.url || '',
      pageTitle: options.pageTitle || '',
      violations: [],
      summary: {
        total: 0,
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
      }
    }
  }

  // Check for missing lang attribute on html element
  if (!/<html[^>]*\slang=/i.test(html)) {
    violations.push({
      id: 'html-lang',
      impact: 'serious',
      description: '<html> element does not have a lang attribute',
      help: 'The lang attribute of the <html> element must be set',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/html-lang-valid',
      nodes: [{
        html: html.match(/<html[^>]*>/i)?.[0] || '<html>',
        target: 'html'
      }]
    })
  }

  // Check for images without alt attributes
  const imgWithoutAlt = html.match(/<img(?![^>]*\balt=)([^>]*)>/gi) || []
  imgWithoutAlt.forEach((img) => {
    violations.push({
      id: 'image-alt',
      impact: 'critical',
      description: 'Image does not have an alt attribute',
      help: 'Images require alternative text for screen readers',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/image-alt',
      nodes: [{
        html: img,
        target: img
      }]
    })
  })

  // Check for empty alt attributes (potential decorative images that need verification)
  const imgWithEmptyAlt = html.match(/<img[^>]*\balt=["']["'][^>]*>/gi) || []
  imgWithEmptyAlt.forEach((img) => {
    violations.push({
      id: 'alt-space',
      impact: 'minor',
      description: 'Image alt attribute may be empty when it should contain text',
      help: 'Verify that the empty alt is intentional for decorative images',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/image-alt',
      nodes: [{
        html: img,
        target: img
      }]
    })
  })

  // Check for buttons without accessible names
  const buttonsWithoutText = html.match(/<button(?![^>]*>)[^>]*>(?!\s*[\w])/gi) || []
  buttonsWithoutText.forEach((btn) => {
    violations.push({
      id: 'button-name',
      impact: 'critical',
      description: 'Button element does not have accessible text',
      help: 'Buttons must have distinguishable text for screen readers',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/button-name',
      nodes: [{
        html: btn,
        target: btn
      }]
    })
  })

  // Check for links with no text content
  const linksWithoutText = html.match(/<a(?![^>]*>)[^>]*href=["'][^"']+["'](?![^<]*>[^<]*<\/a>)[^>]*>(?!\s*[\w])/gi) || []
  linksWithoutText.forEach((link) => {
    violations.push({
      id: 'link-name',
      impact: 'serious',
      description: 'Link element does not have accessible text',
      help: 'Links must have text that describes the purpose of the link',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/link-name',
      nodes: [{
        html: link,
        target: link
      }]
    })
  })

  // Check for missing landmark elements
  if (!/<main[^>]*>/i.test(html) && !/<div[^>]*role=["']main["']/i.test(html)) {
    violations.push({
      id: 'region',
      impact: 'moderate',
      description: 'Page does not have a <main> landmark',
      help: 'Document should have a <main> landmark for primary content',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/region',
      nodes: [{
        html: '<body>...</body>',
        target: 'body'
      }]
    })
  }

  // Check for tables without headers
  const tables = html.match(/<table[^>]*>[\s\S]*?<\/table>/gi) || []
  tables.forEach((table) => {
    const hasHeader = /<th[^>]*>/i.test(table)
    const isDataTable = /<caption/i.test(table) || hasHeader
    if (!isDataTable && table.split('<tr').length > 2) {
      violations.push({
        id: 'th-in-data-table',
        impact: 'moderate',
        description: 'Complex table does not have header cells',
        help: 'Data tables should have proper header cells for accessibility',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/th-in-data-table',
        nodes: [{
          html: table.substring(0, 200) + (table.length > 200 ? '...' : ''),
          target: 'table'
        }]
      })
    }
  })

  // Check for tables missing captions
  const tablesWithoutCaption = html.match(/<table(?![^>]*<caption)[^>]*>[\s\S]*?<\/table>/gi) || []
  if (tablesWithoutCaption.length > 0) {
    violations.push({
      id: 'table_caption',
      impact: 'moderate',
      description: 'Table does not have a caption',
      help: 'Tables should have a caption to describe the table purpose',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/table_caption',
      nodes: tablesWithoutCaption.map((t) => ({
        html: t.substring(0, 100) + (t.length > 100 ? '...' : ''),
        target: 'table'
      }))
    })
  }

  // Check for SVGs without accessible names
  const svgsWithoutName = html.match(/<svg(?![^>]*<(title|aria-label|aria-labelledby))[^>]*>[\s\S]*?<\/svg>/gi) || []
  svgsWithoutName.forEach((svg) => {
    violations.push({
      id: 'svg_aria_permitted',
      impact: 'minor',
      description: 'SVG does not have an accessible name',
      help: 'SVGs should have a <title> or aria-label for accessibility',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/svg_aria_permitted',
      nodes: [{
        html: svg.substring(0, 100) + (svg.length > 100 ? '...' : ''),
        target: 'svg'
      }]
    })
  })

  // Check for duplicate landmark roles
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search']
  landmarkRoles.forEach((role) => {
    const pattern = new RegExp(`role=["']${role}["']`, 'gi')
    const matches = html.match(pattern)
    if (matches && matches.length > 1) {
      violations.push({
        id: 'landmark-unique',
        impact: 'moderate',
        description: `Document has more than one "${role}" landmark`,
        help: 'Landmarks should be unique on the page',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/region',
        nodes: [{
          html: `<element role="${role}">`,
          target: `[role="${role}"]`
        }]
      })
    }
  })

  // Check for headings hierarchy issues
  const headings = html.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || []
  if (headings.length > 0) {
    const headingLevels = headings.map((h) => {
      const match = h.match(/<h([1-6])/i)
      return match ? parseInt(match[1], 10) : null
    }).filter((level) => level !== null)

    // Check for heading skip levels (e.g., h1 directly to h3)
    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        violations.push({
          id: 'heading-order',
          impact: 'moderate',
          description: 'Heading levels should only increase by one',
          help: 'Headings should follow a logical nesting order',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/heading-order',
          nodes: [{
            html: headings[i],
            target: headings[i].match(/<h[1-6]/i)?.[0] || 'h?'
          }]
        })
        break
      }
    }
  }

  // Check for fake links (span/div with onclick)
  const fakeLinks = html.match(/<(span|div)[^>]*(onclick=["'][^"']*location[^"']*["'])[^>]*>/gi) || []
  fakeLinks.forEach((link) => {
    violations.push({
      id: 'link-in-link-text',
      impact: 'serious',
      description: 'Element used as a link should be an <a> element',
      help: 'Use semantic <a> elements for links instead of spans or divs with click handlers',
      helpUrl: 'https://dequeuniversity.com/rules/axe/4.8/link-in-link-text',
      nodes: [{
        html: link,
        target: link
      }]
    })
  })

  // Build summary
  const summary = {
    total: violations.length,
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length,
    moderate: violations.filter((v) => v.impact === 'moderate').length,
    minor: violations.filter((v) => v.impact === 'minor').length
  }

  return {
    timestamp: new Date().toISOString(),
    url: options.url || '',
    pageTitle: options.pageTitle || '',
    violations,
    summary
  }
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
  generateAccessibilityReport
}

// Run if executed directly
if (require.main === module) {
  main()
}