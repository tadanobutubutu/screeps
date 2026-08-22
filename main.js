// main.js - Fixed REACT_027 React Table Structure issues

function validateTableStructure(headers) {
  return headers.map((header, index) => ({
    ...header,
    scope: header.rowSpan > 1 || index === 0 ? 'row' : 'col'
  }));
}

function createTableHeader(text, isRowHeader = false) {
  return `<th scope="${isRowHeader ? 'row' : 'col'}">${text}</th>`;
}

function renderTable(headers, rows) {
  const validatedHeaders = validateTableStructure(headers);
  
  let html = '<table><thead><tr>';
  validatedHeaders.forEach(header => {
    html += createTableHeader(header.text, header.isRowHeader);
  });
  html += '</tr></thead><tbody>';
  
  rows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, index) => {
      const isRowHeader = validatedHeaders[index]?.isRowHeader;
      html += isRowHeader 
        ? `<th scope="row">${cell}</th>` 
        : `<td>${cell}</td>`;
    });
    html += '</tr>';
  });
  
  html += '</tbody></table>';
  return html;
}

module.exports = { validateTableStructure, createTableHeader, renderTable };