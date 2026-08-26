function validateTableStructure(table) {
  // Validate id
  if (!table.id || typeof table.id !== 'string') return false;

  // Validate columns
  if (!Array.isArray(table.columns) || table.columns.length === 0) return false;
  const allIds = new Set();
  for (const column of table.columns) {
    if (!column.id || typeof column.id !== 'string') return false;
    if (allIds.has(column.id)) return false;
    allIds.add(column.id);
  }

  // Validate data
  if (!Array.isArray(table.data) || table.data.length === 0) return false;
  for (const row of table.data) {
    if (!Array.isArray(row) || row.length !== table.columns.length) return false;
    for (const cell of row) {
      const columnIndex = table.columns.findIndex(col => col.id === cell.id);
      if (columnIndex !== -1 && (!cell.value || typeof cell.value !== 'string')) return false;
    }
  }

  // If all checks pass, return true
  return true;
}

// TODO: existing code

module.exports = {
  // existing exports
};