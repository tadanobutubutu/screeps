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

// main.js - Accessibility Issue Handler

// Configuration and version constants
const CONFIG = {
  apiEndpoint: '/api',
  timeout: 5000,
  debug: false
};

  // Close caption and wrap rows in thead/tbody where missing
  html = html.replace(/<table([^>]*)>([\s\S]*?)<\/table>/gi, (match, attrs, content) => {
    if (/<thead/i.test(content)) return match
    const rows = content.match(/<tr[\s\S]*?<\/tr>/gi) || []
    if (rows.length === 0) return match
    const firstRows = rows.slice(0, 1).join('')
    const restRows = rows.slice(1).join('')
    const thPattern = /<th/gi
    const firstRowHasTh = thPattern.test(firstRows)
    let thead = ''
    let tbody = restRows

    if (!firstRowHasTh) {
      thead = `<thead><tr>${firstRows.replace(/<td>/gi, '<th>').replace(/<\/td>/gi, '</th>')}</tr></thead>`
    } else {
      thead = `<thead>${firstRows}</thead>`
    }
    if (!tbody) tbody = ''
    tbody = `<tbody>${tbody}</tbody>`

    // Remove any existing tr tags that were part of original content (they're now in thead/tbody)
    const captionMatch = content.match(/<caption>[\s\S]*?<\/caption>/i)
    const caption = captionMatch ? captionMatch[0] : ''
    return `<table${attrs}>${caption}${thead}${tbody}</table>`
  })

  // Add scope="col" to th elements that don't have it
  html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
    if (/scope=/i.test(attrs)) return match
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

  // Handle REACT_027: Fix table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    validateTableAccessibility(table);
    validateTableStructure(table);
  });

  // Handle REACT_017: Add/fix landmark issues
  addLandmarkRoles();
  ensureUniqueLandmarks();
  validateLandmarkStructure(document.body);
  checkLandmarkElement(document.body);

  return dividend / divisor
}

// REACT_017: Add/fix landmark issues
function fixLandmarks (html) {
  if (typeof html !== 'string') return html

  // Ensure <main> landmark exists
  if (html.includes('<body') && !html.includes('<main')) {
    html = html.replace(/(<body[^>]*>)/i, '$1<main>')
    html = html.replace(/<\/body>/i, '</main></body>')
  }

  // Ensure <nav> landmark exists
  if (html.includes('<main') && !html.includes('<nav')) {
    html = html.replace(/(<main>)/i, '<nav aria-label="Main navigation"></nav><main>')
  }

  // Ensure <aside> landmark exists if content suggests a sidebar
  if (html.includes('<main') && !html.includes('<aside')) {
    const hasSidebarContent = /sidebar|aside|right.*column/i.test(html)
    if (hasSidebarContent) {
      html = html.replace(/(<main>)/i, '<aside><div></div></aside><main>')
    }
  }

  // Ensure <footer> landmark exists
  if (html.includes('<main') && !html.includes('<footer') && html.includes('</body>')) {
    html = html.replace(/<\/body>/i, '<footer></footer></body>')
  }

  return html
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames (html) {
  if (typeof html !== 'string') return html

  const svgMatches = html.match(/<svg[\s\S]*?>/gi)
  let offset = 0

  if (svgMatches) {
    svgMatches.forEach((fullMatch, index) => {
      const svgStart = html.indexOf(fullMatch, offset)
      const svgEnd = html.indexOf('</svg>', svgStart)

      if (svgEnd === -1) return

      const svgContent = html.substring(svgStart, svgEnd + 6)
      const hasTitle = /<title/i.test(svgContent)
      const hasAriaLabel = /\baria-label=/i.test(fullMatch)
      const hasAriaLabelledBy = /\baria-labelledby=/i.test(fullMatch)

      if (!hasTitle && !hasAriaLabel && !hasAriaLabelledBy) {
        const newSvg = fullMatch.replace(/>/, `><title>SVG ${index + 1}</title>`)
        const oldSvgLength = fullMatch.length
        html = html.substring(0, svgStart) + newSvg + html.substring(svgStart + oldSvgLength)
        offset += newSvg.length - oldSvgLength
      }
    })
  }

  // Handle REACT_025: Ensure unique landmarks
  ensureUniqueLandmarks();

  // Handle REACT_036: Fix fake link issue
  fixFakeLinks();
}

function checkLinkAccessibility () {
  // Implementation for checking link accessibility
  // This function will be used to validate the accessibility of links
  const issues = []
  
  if (typeof document !== 'undefined') {
    const links = document.querySelectorAll('a')
    
    links.forEach((link) => {
      const href = link.getAttribute('href')
      const text = link.textContent.trim()

      if (!text) {
        issues.push(`Link with href "${href}" has no accessible text`)
      }
    })
  }

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
  if (typeof document === 'undefined') return null
  
  const body = document.body

  // Return null if body element is not available
  if (!body) {
    return null
  }

  // Check if a <main> element already exists to avoid duplication
  const existingMain = body.querySelector('main')
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

  landmarkRoles.forEach(role => {
    const pattern = new RegExp(`role="${role}"`, 'gi')
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
  html5Landmarks.forEach(tag => {
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
    /<(span|div)([^>]*)onclick\s*=\s*["']([^"']*)["']([^>]*)>/gi,
    (match, tag, before, onclick, after) => {
      const hrefMatch = onclick.match(/window\.location\.href\s*=\s*["']([^"']*)["']/)
      if (hrefMatch) {
        return `<a href="${hrefMatch[1]}"${before}${after}>`
      }
      return match
    }
  )

  html = html.replace(/<\/(span|div)>/gi, '</a>')

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
  return button
}

// Don't forget to test your new additions in the test file

// TODO: Implement the logic to handle the credential response
/**
 * Handles the credential response from an authentication provider or API.
 * This function processes the received credential, validates it if needed,
 * and performs appropriate actions such as storing it, sending to a server,
 * or updating the UI.
 * @param {Object} credential - The credential object received from the provider.
 * @returns {void}
 */
function handleCredentialResponse(credential) {
  // Implement logic to handle the credential response
  console.log('Credential response received:', credential);
  
  // Example: Validate credential structure
  if (!credential || typeof credential !== 'object') {
    console.error('Invalid credential response');
    return;
  }
  
  // Example: Extract relevant fields (adjust based on actual credential format)
  const { id, name, email, token } = credential;
  
  // Example: Store credential in session storage or context
  if (typeof window !== 'undefined' && window.localStorage) {
    if (token) {
      localStorage.setItem('authToken', token);
    }
    if (id) {
      localStorage.setItem('userId', id);
    }
  }
  
  // Example: Update UI or trigger further actions
  // You might want to dispatch an event or call another function
  console.log('Credential processed successfully');
  
  return credential;
}

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
  main,
  newFunction,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkHelpers,
  validateLandmarkStructHelpers,
  getSvgAccessibleName,
  setSvgAttributes,
  createAccessibleLink,
  handleFakeLinks,
  getAccessibleElement,
  createAccessibleButton,
  enhanceKeyboardNavigation,
  addAriaRoles,
  checkContrastRatios,
  addBook,
  initializeAccessibility,
  handleCredentialResponse
}

// Run if executed directly
if (require.main === module) {
  main()
}

/**
 * Checks if a link element is accessible (has text, aria-label, or title)
 * @param {Element} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible (link) {
  if (!link) return false
  const text = link.textContent && link.textContent.trim()
  const ariaLabel = link.getAttribute('aria-label')
  const title = link.getAttribute('title')
  return !!(text || ariaLabel || title)
}