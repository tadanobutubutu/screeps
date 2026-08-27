// Assuming this is a simplified example of a table structure
function createTable(data) {
  // ... other code ...

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  data.columns.forEach((column) => {
    const th = document.createElement('th');
    th.textContent = column.label; // Assuming 'label' is a property of each column
    th.setAttribute('scope', 'col'); // Add the scope attribute
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  data.rows.forEach((row) => {
    const tr = document.createElement('tr');
    row.cells.forEach((cell) => {
      const td = document.createElement('td');
      td.textContent = cell.value; // Assuming 'value' is a property of each cell
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  const table = document.createElement('table');
  table.appendChild(thead);
  table.appendChild(tbody);

  // ... other code ...
}

// Usage example
const tableData = {
  columns: [
    { label: 'Column 1' },
    { label: 'Column 2' },
    // ... more columns
  ],
  rows: [
    { cells: [{ value: 'Row 1, Cell 1' }, { value: 'Row 1, Cell 2' }] },
    { cells: [{ value: 'Row 2, Cell 1' }, { value: 'Row 2, Cell 2' }] },
    // ... more rows
  ],
};

createTable(tableData);