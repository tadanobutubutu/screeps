(() => {
  // ... Existing code ...

  // New function to fix table structure issues
  function fixTableStructureIssues() {
    $('table').each((index, table) => {
      const $table = $(table);
      const headers = $table.find('thead th');
      const rows = $table.find('tbody tr');

      // Ensure table has thead and tbody
      if (!$table.find('thead').length) {
        const $firstRow = $table.find('tr').first();
        if ($firstRow.length) {
          $table.prepend('<thead></thead>');
          $firstRow.children().each(function() {
            $table.find('thead').append($(this).clone());
          });
          $firstRow.detach();
          $table.append('<tbody></tbody>');
          $table.find('tbody').append($firstRow);
        }
      }

      // Add scope attribute to header cells
      $table.find('thead th').each(function() {
        $(this).attr('scope', 'col');
      });

      // Ensure headers match the number of cells in the first row
      if (headers.length !== rows[0].children.length) {
        throw new Error('Table headers and rows do not match in length');
      }

      // Ensure each row has the same number of cells as headers
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].children.length !== headers.length) {
          throw new Error(`Mismatched header and row cells at row ${i + 1}`);
        }
      }

      // Validate table structure
      try {
        validateTableStructure($table);
      } catch (e) {
        console.warn('Table structure validation error:', e.message);
      }
    });
  }

  // ... Existing functions ...

  // Add the new functions to exports
  module.exports = {
    wrapContentInMain,
    addScopeToTh,
    createTableHeaders,
    replaceFakeLinkWithButton,
    addScopeToThs,
    validateTableStructure,
    fixTableStructureIssues,
    ensureUniqueLandmarks
  };
})();