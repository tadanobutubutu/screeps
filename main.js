// main.js - Console Table Visualization
// This file generates visual tables for the Screeps game console
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

function createTable(headers, rows) {
    const headerRow = headers.map(h => `<th scope="col">${h}</th>`).join('');
    const bodyRows = rows.map(row => 
        '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>'
    ).join('');
    return `<table><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function printTable(title, data) {
    if (!data || data.length === 0) {
        console.log('No data to display');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(h => item[h] || ''));
    
    console.log(`%c${title}`, 'font-weight: bold; color: #ff0;');
    console.log(createTable(headers, rows));
}

module.exports = { createTable, printTable };