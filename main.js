/**
 * Performs accessibility checks on tables in the document.
 * Verifies that tables have proper headers, captions, and scope attributes.
 * @returns {Object} An object containing accessibility issues found in tables
 */
function checkTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const issues = [];

  tables.forEach((table, index) => {
    // Check for caption
    const caption = table.querySelector('caption');
    if (!caption || !caption.textContent.trim()) {
      issues.push({
        tableIndex: index,
        type: 'missing-caption',
        message: `Table ${index + 1} is missing a caption element with content.`
      });
    }

    // Check for headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      issues.push({
        tableIndex: index,
        type: 'missing-headers',
        message: `Table ${index + 1} has no <th> header cells.`
      });
    }

    // Check that <th> elements have scope attribute
    headers.forEach((header, hIndex) => {
      if (!header.hasAttribute('scope')) {
        issues.push({
          tableIndex: index,
          type: 'missing-scope',
          message: `Header cell ${hIndex + 1} in table ${index + 1} is missing a scope attribute.`
        });
      }
    });
  });

  return {
    totalTables: tables.length,
    issueCount: issues.length,
    issues
  };
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { checkTableAccessibility };
}