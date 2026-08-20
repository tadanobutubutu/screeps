/**
 * Main JavaScript file for accessibility fixes
 * Addresses REACT_027 - React Table Structure warning
 * 
 * 🔧 ADDED: Accessibility fix for REACT_036 - React Fake Link
 */
import { accessibilityChecker } from './accessibility-checker';

// Utility function to add scope attribute to table header cells
function addScopeToTableHeaders(table) {
    if (!table || table.tagName !== 'TABLE') return table;
    const rows = table.querySelectorAll('tr');
    const firstRow = rows[0];
    
    if (!firstRow) return table;
    
    const headerCells = firstRow.querySelectorAll('th');
    headerCells.forEach(cell => {
        if (!cell.hasAttribute('scope')) cell.setAttribute('scope', 'col');
    });

    rows.forEach((row, index) => {
        if (index === 0) return;
        const firstCell = row.querySelector('th');
        if (firstCell && !firstCell.hasAttribute('scope')) 
            firstCell.setAttribute('scope', 'row');
    });
    return table;
}

// Process all tables in a document or element
function processTables(rootElement = document) {
    const tables = rootElement.querySelectorAll('table');
    tables.forEach(addScopeToTableHeaders);
    return tables.length;
}

// Accessibility fixer function for REACT_036
function fixFakeLinks(rootElement = document) {
    const anchors = rootElement.querySelectorAll('a[href="#"]');
    anchors.forEach(anchor => {
        anchor.removeAttribute('href');
        anchor.setAttribute('tabindex', '-1');
    });
}

// Export for testing
module.exports = {
    addScopeToTableHeaders,
    processTables,
    accessibilityChecker,
    fixFakeLinks
};