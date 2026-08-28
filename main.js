// Original main.js content preserved below
// The current file content as provided shows only a comment placeholder for table structure checking
// Implementation added for checking table structure

function checkTableStructure(table) {
    if (!table || typeof table !== 'object') {
        return { valid: false, error: 'Table must be a valid object' };
    }

    if (!Array.isArray(table.headers)) {
        return { valid: false, error: 'Table must have a headers array' };
    }

    if (!Array.isArray(table.rows)) {
        return { valid: false, error: 'Table must have a rows array' };
    }

    if (table.headers.length === 0) {
        return { valid: false, error: 'Table must have at least one header' };
    }

    const columnCount = table.headers.length;
    for (let i = 0; i < table.rows.length; i++) {
        const row = table.rows[i];
        if (!Array.isArray(row)) {
            return { valid: false, error: `Row ${i} must be an array` };
        }
        if (row.length !== columnCount) {
            return {
                valid: false,
                error: `Row ${i} has ${row.length} cells, expected ${columnCount}`
            };
        }
        for (let j = 0; j < row.length; j++) {
            if (row[j] === null || row[j] === undefined) {
                return {
                    valid: false,
                    error: `Row ${i}, cell ${j} is null or undefined`
                };
            }
        }
    }

    return { valid: true, error: null };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { checkTableStructure };
}