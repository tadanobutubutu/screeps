// TODO: Implement this function for accessibility checks on tables
function checkTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, issues: ['Element is not a table'] };
  }

  const issues = [];

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption || !caption.textContent.trim()) {
    issues.push('Table is missing a caption');
  }

  // Check for proper table structure
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    issues.push('Table has no rows');
  }

  // Check headers
  const hasHeaders = table.querySelector('th') !== null;
  if (!hasHeaders) {
    issues.push('Table is missing header cells (<th>)');
  }

  // Check scope attribute on headers
  const headerCells = table.querySelectorAll('th');
  headerCells.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`Header cell at index ${index} is missing scope attribute`);
    }
  });

  return {
    valid: issues.length === 0,
    issues
  };
}

module.exports = { checkTableAccessibility };