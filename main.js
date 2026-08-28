function validateTableStructure(table) {
  if (!table || typeof table !== 'object' || table.tagName !== 'TABLE') {
    return false;
  }

  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) {
    return false;
  }

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td, th');
    if (cells.length === 0) {
      return false;
    }
  }

  return true;
}

function validateTableAccessibility(table) {
  if (!table || typeof table !== 'object' || table.tagName !== 'TABLE') {
    return false;
  }

  const caption = table.querySelector('caption');
  if (!caption || caption.textContent.trim().length === 0) {
    return false;
  }

  const headers = table.querySelectorAll('th');
  for (let i = 0; i < headers.length; i++) {
    if (!headers[i].hasAttribute('scope')) {
      return false;
    }
  }

  return true;
}

module.exports = {
  validateTableStructure,
  validateTableAccessibility
};