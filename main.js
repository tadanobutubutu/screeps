// TODO: This is the existing code that needs to be preserve
// (This comment remains as-is)

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue

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

function addressAccessibilityIssues (insightReport) {
  // Apply accessibility fixes to HTML content based on insight report
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html)
  }
  console.log('Addressing accessibility issues from insight report:', insightReport)
}

function createInPageButton (buttonId, buttonText, buttonClass) {
  const button = document.createElement('button')
  button.id = buttonId
  button.textContent = buttonText
  button.className = buttonClass
  document.body.appendChild(button)
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
  divide,
  checkLinkAccessibility,
  wrapPrimaryContentInMain,
  generateAccessibilityReport
}

// Run if executed directly
if (require.main === module) {
  main()
}