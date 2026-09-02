// REACT_015: Add lang attribute to the <html> element
function addLangAttribute (html) {
  if (typeof html !== 'string') return html
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match
    return `<html${attrs} lang="en">`
  })
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure (html) {
  if (typeof html !== 'string') return html

  // Ensure every table has a thead, tbody, and th elements with scope attributes
  return html.replace(/<table(.*?)>/g, (match, tableAttrs) => {
    if (!match.includes('<thead>') && !match.includes('<tbody>')) {
      return `<table ${tableAttrs}>
          <thead></thead>
          <tbody></tbody>
        </table>`
    }
    return match;
  })
  .replace(/<tr>(.*?)<\/tr>/g, (match, row) => {
    return match.replace(/<th(.*?)>/g, (match, thAttrs) => {
      return `<th ${thAttrs} scope="col">$1</th>`
    })
  })
  .replace(/<table(.*?)>/g, (match, tableAttrs) => {
    if (match.includes('caption')) return match;
    return match + '<caption></caption>';
  });
}

// NEW: Implement upgrade logic
function upgradeSite(html) {
  // Add or upgrade elements as needed
  // ...

  // Ensure structural requirements are met (e.g., add lang attribute to html tag, fix table structure)
  return addLangAttribute(fixTableStructure(html));
}

// Exports
module.exports = {
  addLangAttribute,
  fixTableStructure,
  upgradeSite,
};