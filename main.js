// main.js - Accessibility Issue Handler

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

  // REACT_025: Ensure unique landmarks
  html = ensureUniqueLandmarks(html)

  // REACT_036: Fix fake link issues
  html = fixFakeLinks(html)

  return html
}

// New Function: REACT_017: Validate and add/fix landmark issues
function validateAndFixLandmarks(html) {
  // Add your code here to validate and add/fix landmarks according to the report
}

// New Function: REACT_041: Add accessible names to 2 SVGs
function addSvgAccessibleName(html, svgId, accessibleName) {
  // Add your code here to add accessible names to the specified SVG
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes (html) {
  let result = html
  result = addLangAttribute(result)
  result = fixTableStructure(result)
  result = fixFakeLinks(result)
  result = validateAndFixLandmarks(result) // Add this after fixing landmark issues
  result = addSvgAccessibleName(result, 'ID_OF_SVG_1', 'Accessible Name 1') // Add this for the first SVG
  result = addSvgAccessibleName(result, 'ID_OF_SVG_2', 'Accessible Name 2') // Add this for the second SVG
  return result
}

// Export the function to be used in tests
module.exports = applyAccessibilityFixes