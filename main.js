// Original content of main.js (with conflict markers removed)
const tableHeader = [
  { id: 'column1', label: 'Column 1' },
  { id: 'column2', label: 'Column 2' },
  { id: 'column3', label: 'Column 3' },
  // ... other columns
];

const renderTable = () => {
  const thead = document.createElement('thead');
  const row = document.createElement('tr');
  tableHeader.forEach(column => {
    const th = document.createElement('th');
    th.textContent = column.label;
    th.id = column.id;
    row.appendChild(th);
  });
  thead.appendChild(row);
  return thead;
};

// ... other code