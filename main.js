// main.js

/**
 * Checks the structure of a table and validates it against expected schema
 * @param {Object} table - The table object to check
 * @param {Array} expectedColumns - Array of expected column definitions
 * @returns {Object} - Validation result with isValid boolean and error messages
 */
function checkTableStructure(table, expectedColumns = []) {
    const result = {
        isValid: true,
        errors: []
    };

    if (!table || typeof table !== 'object') {
        result.isValid = false;
        result.errors.push('Table must be a valid object');
        return result;
    }

    // Check if table has columns property
    if (!Array.isArray(table.columns)) {
        result.isValid = false;
        result.errors.push('Table must have a columns array');
        return result;
    }

    // Validate each expected column exists
    const tableColumns = table.columns.map(col => col.name || col);
    
    expectedColumns.forEach(expected => {
        const columnName = typeof expected === 'string' ? expected : expected.name;
        if (!tableColumns.includes(columnName)) {
            result.isValid = false;
            result.errors.push(`Missing expected column: ${columnName}`);
        }
    });

    // Check for unexpected columns if strict mode is needed
    if (table.strict && expectedColumns.length > 0) {
        const expectedColumnNames = expectedColumns.map(e => typeof e === 'string' ? e : e.name);
        table.columns.forEach(col => {
            const colName = col.name || col;
            if (!expectedColumnNames.includes(colName)) {
                result.isValid = false;
                result.errors.push(`Unexpected column found: ${colName}`);
            }
        });
    }

    return result;
}

// TODO: Implement this function for checking table structure

module.exports = {
    checkTableStructure
};