// Import required module(s) - for fixing table structure issues

// TODO: Import required module(s) - for fixing table structure issues

const fs = require('fs');
const path = require('path');
const { tableUtils } = require('./utils/tableUtils');
const { formatTable, parseTableStructure } = require('./utils/tableFormatter');

/**
 * Process table data and fix structure issues
 * @param {Array} data - Table data to process
 * @returns {Object} Processed table with fixed structure
 */
function processTableData(data) {
    if (!Array.isArray(data)) {
        throw new Error('Data must be an array');
    }
    
    const structuredData = parseTableStructure(data);
    return formatTable(structuredData);
}

/**
 * Validate table structure
 * @param {Object} table - Table object to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateTableStructure(table) {
    if (!table || typeof table !== 'object') {
        return false;
    }
    
    return tableUtils.validateSchema(table);
}

/**
 * Get table from file
 * @param {string} filePath - Path to the table file
 * @returns {Object} Table data
 */
function getTableFromFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const content = fs.readFileSync(absolutePath, 'utf-8');
    return JSON.parse(content);
}

/**
 * Save table to file
 * @param {string} filePath - Path to save the table
 * @param {Object} tableData - Table data to save
 */
function saveTableToFile(filePath, tableData) {
    const absolutePath = path.resolve(filePath);
    fs.writeFileSync(absolutePath, JSON.stringify(tableData, null, 2));
}

module.exports = {
    processTableData,
    validateTableStructure,
    getTableFromFile,
    saveTableToFile
};