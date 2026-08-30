// Main module for calculator operations

// TODO: Implement divide function that handles division with proper error handling
function divide(dividend, divisor) {
    // Check if inputs are valid numbers
    if (typeof dividend !== 'number' || typeof divisor !== 'number') {
        throw new Error('Both dividend and divisor must be numbers');
    }
    
    // Check for NaN
    if (isNaN(dividend) || isNaN(divisor)) {
        throw new Error('Both dividend and divisor must be valid numbers');
    }
    
    // Check for division by zero
    if (divisor === 0) {
        throw new Error('Cannot divide by zero');
    }
    
    return dividend / divisor;
}

// Function for accessibility checks on tables
function checkTableAccessibility(table) {
    const errors = [];
    
    // Check if table exists
    if (!table) {
        errors.push('Table must exist');
        return { valid: false, errors };
    }
    
    // Check if table has headers
    if (!table.headers || table.headers.length === 0) {
        errors.push('Tables must have header cells for accessibility');
    }
    
    // Check if table has a caption or title for context
    if (!table.caption && !table.title) {
        errors.push('Tables should have a caption or title for accessibility');
    }
    
    // Check if data cells have proper scope or headers attributes
    if (table.rows && table.rows.length > 0) {
        table.rows.forEach((row, rowIndex) => {
            if (row.cells) {
                row.cells.forEach((cell, cellIndex) => {
                    if (cell.isHeader && !cell.scope && !cell.headers) {
                        errors.push(`Header cell at row ${rowIndex}, column ${cellIndex} should have a scope or headers attribute`);
                    }
                });
            }
        });
    }
    
    return {
        valid: errors.length === 0,
        errors
    };
}

module.exports = { divide, checkTableAccessibility };