(() => {
  // ... Existing code ...

  // New function to add scope attribute to th elements
  function addScopeToTh(element) {
    if ($(element).prop('tagName') === 'TH') {
      $(element).attr('scope', 'col');
    }
  }

  // Function to add scope attribute to multiple th elements
  function addScopeToThs(elements) {
    elements.forEach((element) => {
      addScopeToTh(element);
    });
  }

  // New function to validate table structure
  function validateTableStructure(table) {
    const headers = table.find('thead th');
    const rows = table.find('tbody tr');

    if (headers.length !== rows[0].children.length) {
      throw new Error('Table headers and rows do not match in length');
    }

    for (let i = 1; i < rows.length; i++) {
      if (rows[i].children.length !== headers.length) {
        throw new Error(`Mismatched header and row cells at row ${i + 1}`);
      }
    }
  }

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

      // Validate table structure
      try {
        validateTableStructure($table);
      } catch (e) {
        console.warn('Table structure validation error:', e.message);
      }
    });
  }

  // New function to ensure unique landmarks
  function ensureUniqueLandmarks() {
    // Track seen landmark roles to ensure uniqueness
    const seenLandmarks = {};
    
    // Handle main landmarks
    $('main').each(function(index) {
      if (seenLandmarks['main']) {
        // Convert duplicate main to div with role
        const $this = $(this);
        $this.replaceWith('<div role="main" aria-label="Main content">' + $this.html() + '</div>');
      } else {
        seenLandmarks['main'] = true;
      }
    });

    // Handle other landmarks
    const landmarkTypes = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
    
    landmarkTypes.forEach(role => {
      if (role === 'main') return; // Already handled above
      
      $(`[${role}]`).each(function(index) {
        if (seenLandmarks[role]) {
          const $this = $(this);
          const newLabel = `${role} region ${index + 1}`;
          $this.attr('aria-label', newLabel);
        }
        seenLandmarks[role] = true;
      });
    });
  }

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