// TODO: Implement this function for accessibility checks on tables
function checkTableAccessibility(table) {
  const issues = [];
  
  if (!table || !table.matches('table')) {
    return issues;
  }

  // Check if table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      type: 'missing-caption',
      message: 'Tables should have a caption element for accessibility'
    });
  }

  // Check if table headers (th) have scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      issues.push({
        type: 'missing-scope',
        message: `Header at index ${index} should have a scope attribute`,
        element: header
      });
    }
  });

  // Check if first row contains proper headers for data tables
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.querySelector('th') === null) {
    issues.push({
      type: 'missing-header',
      message: 'First row should contain header elements (th) for data tables'
    });
  }

  // Check for proper headers association using headers/id attributes
  const cells = table.querySelectorAll('td[data-header-id]');
  cells.forEach(cell => {
    const headerId = cell.getAttribute('data-header-id');
    const associatedHeader = table.querySelector(`#${headerId}`);
    if (!associatedHeader) {
      issues.push({
        type: 'invalid-header-reference',
        message: `Cell references non-existent header id: ${headerId}`,
        element: cell
      });
    }
  });

  return issues;
}