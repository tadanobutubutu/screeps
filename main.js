const main = {
  // TODO: This is the existing code that needs to be preserved

  getLangAttribute,
  getFullLangAttribute,

  countDependencies,

  // TODO: Merged function from both branches
  validateTableAccessibility: function validateTableAccessibility(table) {
    const issues = [];

    // Check for caption (merged from both branches)
    if (!table.querySelector || !table.querySelector('caption')) {
      issues.push('Missing caption element');
    }

    // Check for headers attribute (from HEAD)
    if (!table.getAttribute('headers')) {
      issues.push('Missing headers attribute');
    }

    // Check for scope attribute on header cells (from HEAD)
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(cell => {
      if (!cell.hasAttribute('scope')) {
        issues.push('Missing scope attribute on header cell');
      }
    });

    return {
      success: issues.length === 0,
      issues
    };
  },

  // TODO: Merged function from both branches
  validateTableStructure: function validateTableStructure(tables) {
    const allIssues = [];

    // Handle both single table element and array of tables
    const tableArray = Array.isArray(tables) ? tables : [tables];

    tableArray.forEach((table, index) => {
      // Check for rows (from origin/main)
      const rows = table.querySelectorAll ? table.querySelectorAll('tr') : [];
      if (rows.length === 0) {
        allIssues.push({
          tableIndex: index,
          issues: ['Table has no rows']
        });
      }

      // Validate table accessibility (from HEAD)
      const result = validateTableAccessibility(table);
      if (!result.success) {
        allIssues.push({
          tableIndex: index,
          issues: result.issues
        });
      }
    });

    return {
      success: allIssues.length === 0,
      issues: allIssues
    };
  },

  // New changes from new branch
  newBranchFunction: function newBranchFunction() {
    return 'New branch function executed';
  }
};

// Export all functions for testing and external use
module.exports = main;