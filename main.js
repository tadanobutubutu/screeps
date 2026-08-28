// main.js

// Import required module(s) - for fixing table structure issues
import * as domutils from 'domutils';

export function processTable(tableElement) {
  const rows = [];
  
  function traverse(node) {
    if (node.type === 'tag' && node.name === 'tr') {
      const cells = domutils.getElementsByTagName('td', node);
      const rowData = cells.map(cell => domutils.textContent(cell));
      rows.push(rowData);
    }
    if (node.children) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(tableElement);
  return rows;
}

export function formatTableRow(rowData, columnWidths) {
  return rowData.map((cell, i) => {
    const width = columnWidths[i] || 10;
    return String(cell).padEnd(width);
  }).join(' | ');
}

export function generateTableMarkdown(headers, rows) {
  const columnWidths = headers.map((h, i) => {
    const maxContentWidth = rows.reduce((max, row) => {
      return Math.max(max, String(row[i] || '').length);
    }, 0);
    return Math.max(h.length, maxContentWidth);
  });
  
  const headerRow = formatTableRow(headers, columnWidths);
  const separator = columnWidths.map(w => '-'.repeat(w)).join('-+-');
  const dataRows = rows.map(row => formatTableRow(row, columnWidths));
  
  return `${headerRow}\n${separator}\n${dataRows.join('\n')}`;
}

export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

// ... rest of the code ...