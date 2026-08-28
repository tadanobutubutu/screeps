// Main JavaScript file for accessibility checks

// TODO: Implement this function for accessibility checks on tables
function performTableAccessibilityCheck(table) {
  const issues = [];
  
  // Check if table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      type: 'warning',
      message: 'Table should have a <caption> element for accessibility'
    });
  }
  
  // Check if table has header cells
  const headers = table.querySelectorAll('th');
  const dataCells = table.querySelectorAll('td');
  
  if (headers.length === 0) {
    issues.push({
      type: 'error',
      message: 'Table should have header cells (<th>) for accessibility'
    });
  }
  
  // Check if headers have scope attribute
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      issues.push({
        type: 'warning',
        message: `Header cell ${index + 1} should have a scope attribute`
      });
    }
    
    // Validate scope value
    const scope = th.getAttribute('scope');
    if (scope && !['row', 'col', 'rowgroup', 'colgroup'].includes(scope)) {
      issues.push({
        type: 'error',
        message: `Header cell ${index + 1} has invalid scope attribute value: ${scope}`
      });
    }
  });
  
  // Check for proper table structure
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  
  if (thead && headers.length > 0) {
    const headersInThead = thead.querySelectorAll('th');
    if (headersInThead.length === 0) {
      issues.push({
        type: 'warning',
        message: '<thead> should contain header cells (<th>)'
      });
    }
  }
  
  // Check data cells for headers attribute if needed for complex tables
  if (dataCells.length > 0 && headers.length > 1) {
    dataCells.forEach((td, index) => {
      // For complex tables with multiple headers, recommend headers attribute
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        const rowHeaders = Array.from(td.parentElement?.querySelectorAll('th') || []);
        if (rowHeaders.length === 0) {
          issues.push({
            type: 'info',
            message: `Consider using 'headers' attribute for complex table data cells`
          });
        }
      }
    });
  }
  
  return {
    passed: issues.filter(i => i.type === 'error').length === 0,
    issues
  };
}

// Export for use in other modules
module.exports = {
  performTableAccessibilityCheck
};