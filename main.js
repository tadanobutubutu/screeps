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

  // Add the new validateTableStructure function
  module.exports = {
    wrapContentInMain,
    addScopeToTh,
    createTableHeaders,
    replaceFakeLinkWithButton,
    addScopeToThs,
    validateTableStructure  // Add the new export
  };
})();