// Replace the render function content
const renderTh = source => {
  return `<th scope="col">${source}</th>`;
};

module.exports = {
  // Existing exports except render
  render: function(data) {
    let tableHeader = '';
    data.forEach((source, index) => {
      tableHeader += renderTh(source);
    });

    return `
      <table class="screeps-table">
        <thead>
          <tr>
            ${tableHeader}
          </tr>
        </thead>
        <tbody>
          <!-- Existing tbody content -->
        </tbody>
      </table>
    `;
  },
  // Keep all existing exports unchanged
  renderSourceFile: function(file, content) {
    return `<div class="Highlight">\n${content}</div>`;
  },
  renderClassHierarchy: function(classes, parentClass) {
    // Keep existing implementations unchanged
  },
  renderRoleHierarchy: function(roles, parentRole) {
    // Keep existing implementations unchanged
  },
};