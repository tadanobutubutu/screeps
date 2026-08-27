// Main application entry point

// TODO: Implement validateTableStructure functionality

const fs = require('fs');
const path = require('path');

/**
 * Validates the structure of a table definition
 * @param {Object} tableSchema - The schema definition for the table
 * @param {Array} tableSchema.columns - Array of column definitions
 * @param {string} tableSchema.name - Name of the table
 * @returns {Object} Validation result with isValid boolean and errors array
 */
function validateTableStructure(tableSchema) {
    const errors = [];
    
    if (!tableSchema) {
        errors.push('Table schema is required');
        return { isValid: false, errors };
    }
    
    if (!tableSchema.name || typeof tableSchema.name !== 'string') {
        errors.push('Table name is required and must be a string');
    }
    
    if (!Array.isArray(tableSchema.columns)) {
        errors.push('Table columns must be an array');
        return { isValid: false, errors };
    }
    
    if (tableSchema.columns.length === 0) {
        errors.push('Table must have at least one column');
    }
    
    const columnNames = new Set();
    
    tableSchema.columns.forEach((column, index) => {
        if (!column.name) {
            errors.push(`Column at index ${index} is missing a name`);
        } else {
            if (columnNames.has(column.name)) {
                errors.push(`Duplicate column name: ${column.name}`);
            }
            columnNames.add(column.name);
        }
        
        if (!column.type) {
            errors.push(`Column "${column.name || index}" is missing a type`);
        }
        
        const validTypes = ['string', 'number', 'boolean', 'date', 'object', 'array'];
        if (column.type && !validTypes.includes(column.type)) {
            errors.push(`Invalid column type "${column.type}" for column "${column.name || index}"`);
        }
    });
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Validates multiple table structures
 * @param {Array} schemas - Array of table schemas
 * @returns {Object} Combined validation results
 */
function validateAllTables(schemas) {
    if (!Array.isArray(schemas)) {
        return { isValid: false, errors: ['Schemas must be an array'] };
    }
    
    const allErrors = [];
    const results = [];
    
    schemas.forEach((schema, index) => {
        const result = validateTableStructure(schema);
        results.push({
            tableName: schema?.name || `Table ${index}`,
            ...result
        });
        if (!result.isValid) {
            allErrors.push(...result.errors.map(err => `${schema?.name || 'Unknown'}: ${err}`));
        }
    });
    
    return {
        isValid: allErrors.length === 0,
        errors: allErrors,
        tableResults: results
    };
}

function readFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        throw new Error(`Failed to read file: ${filePath}`);
    }
}

function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    } catch (err) {
        throw new Error(`Failed to write file: ${filePath}`);
    }
}

function getProjectRoot() {
    return path.resolve(__dirname);
}

module.exports = {
    validateTableStructure,
    validateAllTables,
    readFile,
    writeFile,
    getProjectRoot
};