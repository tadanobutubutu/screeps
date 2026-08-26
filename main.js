// main.js
const express = require('express');
const path = require('path');
const fs = require('fs');

// Function to validate and add scope attributes to table headers
function ensureTableHeaderScope(thElement, type = 'col') {
  if (!thElement) return false;
  
  const validScopes = ['col', 'row', 'colgroup', 'rowgroup'];
  const scope = thElement.getAttribute('scope');
  
  if (scope && validScopes.includes(scope)) {
    return true;
  }
  
  // Add default scope if missing or invalid
  thElement.setAttribute('scope', type);
  return true;
}

// Function to fix all table headers in a container
function fixTableHeaders(container) {
  const tables = container ? container.querySelectorAll('table') : document.querySelectorAll('table');
  
  tables.forEach(table => {
    // Fix column headers (first row)
    const firstRow = table.querySelector('thead tr') || table.rows[0];
    if (firstRow) {
      firstRow.querySelectorAll('th').forEach(th => {
        ensureTableHeaderScope(th, 'col');
      });
    }
    
    // Fix row headers (first cell in each row)
    table.querySelectorAll('tbody tr, thead tr').forEach(row => {
      const firstCell = row.querySelector('th');
      if (firstCell) {
        ensureTableHeaderScope(firstCell, 'row');
      }
    });
  });
}

// TODO: Import required module(s) - for fixing table structure issues
const { formatTable, parseTableData } = require('./utils/tableUtils');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/api/data', (req, res) => {
    const data = [
        { id: 1, name: 'Item 1', value: 100 },
        { id: 2, name: 'Item 2', value: 200 },
        { id: 3, name: 'Item 3', value: 300 }
    ];
    res.json(data);
});

app.post('/api/table/generate', (req, res) => {
    try {
        const tableData = req.body.data;
        const formattedTable = formatTable(tableData);
        res.json({ success: true, table: formattedTable });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { 
    app, 
    ensureTableHeaderScope, 
    fixTableHeaders 
};