const main = (html) => {
  // Add lang attribute to HTML element
  const addLangAttribute = (html) => {
    if (typeof html !== 'string') return html
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
      if (/\blang=/i.test(match)) return match
      return `<html${attrs} lang="en">`
    })
  }

  // Fix table structure issues (add thead, tbody, th scope, caption)
  const fixTableStructure = (html) => {
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

  // New: Validate table accessibility
  const validateTableAccessibility = (html) => {
    if (typeof html !== 'string') return true

    // Check for tables without captions
    const tablesWithoutCaptions = html.match(/<table[^>]*>(?!.*<caption[^>]*>)/gi)
    if (tablesWithoutCaptions) {
      console.warn(`Found ${tablesWithoutCaptions.length} tables without captions`)
      return false
    }

    // Check for tables without thead/tbody
    const tablesWithoutStructure = html.match(/<table[^>]*>(?!.*<thead[^>]*>)(?!.*<tbody[^>]*>)/gi)
    if (tablesWithoutStructure) {
      console.warn(`Found ${tablesWithoutStructure.length} tables without proper structure`)
      return false
    }

    return true
  }

  // NEW: Validate landmark structure
  const validateLandmarkStructure = (html) => {
    if (typeof html !== 'string') return true

    const requiredLandmarks = ['main', 'nav', 'footer'];
    let isValid = true

    requiredLandmarks.forEach(landmark => {
      const pattern = new RegExp(`<${landmark}[^>]*>|<div[^>]*role=["']${landmark}["']`, 'i');
      if (!pattern.test(html)) {
        console.warn(`Missing required landmark: ${landmark}`)
        isValid = false
      }
    });

    return isValid
  }

  // NEW: Get language attribute for HTML element
  const getLangAttribute = (html) => {
    if (typeof html !== 'string') return 'en'

    const match = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
    return match ? match[1] : 'en'
  }

  // NEW: Get accessible name for SVG
  const getSvgAccessibleName = (svgElement) => {
    if (!svgElement) return 'SVG'

    if (svgElement.hasAttribute('aria-label')) {
      return svgElement.getAttribute('aria-label')
    }

    if (svgElement.hasAttribute('aria-labelledby')) {
      const id = svgElement.getAttribute('aria-labelledby');
      const labelElement = document.getElementById(id);
      return labelElement ? labelElement.textContent : 'SVG'
    }

    const title = svgElement.querySelector('title');
    return title ? title.textContent : 'SVG'
  }

  // Main function that applies all accessibility fixes
  const applyAccessibilityFixes = (html) => {
    let result = html
    result = addLangAttribute(result)
    result = fixTableStructure(result)
    result = validateLandmarkStructure(result)
    return result
  }

  return applyAccessibilityFixes(html)
}