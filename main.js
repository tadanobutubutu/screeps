/**
 * Main entry point for the application
 */

// Function to create in-page buttons
function createInPageButton (buttonId, buttonText, buttonClass, onClickHandler) {
  const button = document.createElement('button')
  button.id = buttonId
  button.textContent = buttonText
  button.className = buttonClass
  button.onclick = onClickHandler
  button.setAttribute('role', 'button')
  document.body.appendChild(button)
  return button
}

// Function to get the language attribute for HTML element
function getLangAttribute () {
  return document.documentElement.lang || 'en'
}

// Accessibility utilities - preserves the original accessibilityUtils functionality
const accessibilityUtils = {
  addressNewAccessibilityIssues: function (issues) {
    if (!issues || !Array.isArray(issues)) {
      return []
    }

    return issues.map(issue => {
      return {
        id: issue.id,
        description: issue.description,
        severity: issue.severity,
        status: 'addressed',
        addressedAt: new Date().toISOString()
      }
    })
  },

  // New function to address accessibility issues in DOM elements
  addressAccessibilityIssues: function () {
    addressAccessibilityIssues() // Calls existing implementation

    // Add new accessibility improvements
    addressAccessibilityIssuesForNewImplementation()
  },

  // Add new accessibility improvements
  addressAccessibilityIssuesForNewImplementation: function () {
    // Implementation details
  },

  // New function to import a module and execute a function
  importAndExecute: function (modulePath, functionName, callback) {
    require(modulePath)[functionName](callback)
  }
}

// New function to handle keyboard navigation
function handleKeyboardNavigation () {
  // Implementation details
}

// Add export for 'handleKeyboardNavigation' function
// (Exported via module.exports below)

function ensureUniqueLandmarks (html) {
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
  handleKeyboardNavigation,
  getLangAttribute,
  importAndExecute
}

// Accessibility functions from new implementation
// (Integrated into module.exports above)

// Run if executed directly
if (require.main === module) {
  main()
}