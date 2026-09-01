// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
// Importing the necessary functions (for illustration purposes)
import { getLangAttribute, createInPageButton } from './utils/accessibilityUtils';
import {
    validateTableAccessibility,
    validateTableStructure,
} from './utils/tableAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';

// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html, lang = 'en') {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="${lang}">`;
    });
}

// Imported functions and existing functions
import {
    initialize,
    getConfig,
    getVersion,
    setupSkipLinks,
    setupButtonAccessibility,
    createInPageButton,
    performTask,
    handleEvent,
    greet,
    add,
    calculateDiscount,
    addressAccessibilityIssues,
    root,
    validateTableAccessibility,
    validateTableStructure,
    generateAccessibilityReport,
    createUnrotateButton,
    getSvgAccessibleName,
    createAccessibleLink,
    getElementById,
    queryElements
} from './main';

// Add new functions and handling for REACT_027 and addressAccessibilityIssues
function fixTableStructure(tableElement) {
    // Ensure every table has a caption
    if (!tableElement.querySelector('caption')) {
        tableElement.insertAdjacentHTML('afterbegin', '<caption></caption>');
    }

    // Close caption and wrap rows in thead/tbody where missing
    const thead = tableElement.querySelector('thead');
    const tbody = tableElement.querySelector('tbody');
    let rows = [...tableElement.querySelectorAll('tr')];
    if (!rows.length) return;

    if (!thead) {
        thead = document.createElement('thead');
        tbody.parentNode.insertBefore(thead, tbody);
    }

    const firstRow = rows.shift();
    const restRows = rows;
    let thPattern = /<th[^>]*>/gi;
    let firstRowHasTh = thPattern.test(firstRow);

    if (!firstRowHasTh) {
        firstRow.innerHTML = firstRow.innerHTML.replace(/<td>/gi, '<th scope="col">').replace(/<\/td>/gi, '</th>');
        thead.appendChild(firstRow);
    }

    thead.appendChild(restRows[0]);
    restRows.slice(1).forEach((row) => thead.appendChild(row));
    tbody.innerHTML = '';
}

function addressAccessibilityIssues(insightReport) {
    insightReport = insightReport || {};

    // Call existing function to initialize accessibility improvements
    initialize();

    // Iterate through tables and fix table structure issues
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => fixTableStructure(table));

    // Generate accessibility report
    generateAccessibilityReport(insightReport);
}

// Export modified addressAccessibilityIssues function and fixTableStructure function
export {
    addLangAttribute,
    fixTableStructure,
    addressAccessibilityIssues
};