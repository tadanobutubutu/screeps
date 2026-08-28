// main.js - Table validation utilities

/**
 * Checks if a table has the required structure
 * @param {Array} tableData - The table data to check
 * @param {Array} requiredColumns - List of required column names
 * @returns {Object} - { valid: boolean, missingColumns: string[] }
 */
function checkTableStructure(tableData, requiredColumns) {
    if (!Array.isArray(tableData) || tableData.length === 0) {
        return { valid: false, missingColumns: requiredColumns };
    }
    
    const headers = tableData[0];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    return {
        valid: missingColumns.length === 0,
        missingColumns
    };
}

// TODO: This is the existing code that needs to be preserved
// _Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
// <!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->
// <!--- START ADDITIONAL FUNCTION --->
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

// Export the new function if needed
// export { newFunction };

// <!--- END ADDITIONAL FUNCTION --->
// <!--- START MODIFIED FUNCTION --->
function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// <!--- END MODIFIED FUNCTION --->
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: 9e14a7a8fdfef810dc7b463726556b30dceadb72 -->
// <!--- Any other modifications or additions go here --->

module.exports = {
    checkTableStructure
};