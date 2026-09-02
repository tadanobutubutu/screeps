// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html) {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (attrs.includes('lang=')) return match
    return `<html${attrs} lang="en">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a thead
  html = html.replace(/<table([^>]*)>\s*<tr>/gi, (match, attrs) => {
    return `<table${attrs}><thead><tr>`
  })

  // Close thead if followed by tbody
  html = html.replace(/<\/thead>\s*<tr>/gi, '</thead><tbody><tr>')

  // Add scope attribute to th elements in thead
  html = html.replace(/<thead[^>]*>\s*<tr[^>]*>\s*<th/gi, '<thead><tr><th scope="col"')

  // Ensure tables have caption if they don't have one
  html = html.replace(/(<table([^>]*)>)/gi, (match, fullMatch, attrs) => {
    if (html.indexOf('<caption') === -1) {
      return `${fullMatch}<caption></caption>`
    }
    return fullMatch
  })

  return html
}