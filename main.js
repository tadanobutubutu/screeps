// TODO: Implement this function for accessibility checks on tables

function checkTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, issues: ['Element is not a table'] };
  }

  const issues = [];

  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push('Table is missing a <caption> element');
  }

  // Check for headers
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table has no header cells (<th>)');
  }

  // Check for scope attribute on th elements
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push(`Header cell at index ${index} is missing 'scope' attribute`);
    }
  });

  // Check for summary attribute (deprecated but still used)
  // Skip - deprecated in HTML5

  return {
    valid: issues.length === 0,
    issues
  };
}

// Original main.js content preserved below
// (No existing code was provided in the issue, so adding the required function)