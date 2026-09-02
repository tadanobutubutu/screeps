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

  // Implement function for generating an accessibility report based on accessibility issues
  const accessibilityReport = {
    issues: [],
  };

  // Check for common accessibility issues
  const checkBoxes = html.matchAll(/<input type="checkbox"/gi);
  for (const checkbox of checkBoxes) {
    // Check if checkbox has an associated label
    if (!checkbox.nextSibling || !checkbox.nextSibling.nodeName.toLowerCase() === 'label') {
      accessibilityReport.issues.push({
        type: 'missing-checkbox-label',
        node: checkbox,
      });
    }
  }

  const links = html.matchAll(/<a[^>]*>/gi);
  for (const link of links) {
    // Check if link has text content
    if (!link.nextSibling || !link.nextSibling.nodeName.toLowerCase() === '#text') {
      accessibilityReport.issues.push({
        type: 'empty-link',
        node: link,
      });
    }
  }

  // Save the report to a string and add it to the function's return value
  accessibilityReport.report = JSON.stringify(accessibilityReport, null, 2);

  return addLangAttribute(html, 'en')
    .then(html => fixTableStructure(html))
    .then(html => fixFakeLinks(html))
    .then(() => accessibilityReport);
}

// Main function that applies all accessibility fixes and generates report
function applyAccessibilityFixes (html) {
  let result = html;
  result = addLangAttribute(result);
  result = fixTableStructure(result);
  result = fixFakeLinks(result);
  return applyAccessibilityReport(result);
}

// Function to asynchronously apply accessibility report
async function applyAccessibilityReport (html) {
  const report = await applyAccessibilityFixes(html);
  if (report.issues.length > 0) {
    throw new Error(report.report);
  }
  return report;
}