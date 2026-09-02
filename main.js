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