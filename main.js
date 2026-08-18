// No changes needed to main.js since the issue is in the HTML file
// The fix should be applied to docs/dependency-graph.html instead
// main.js
// This file contains the main application logic for the Screeps AI

module.exports = {
  // ... other exports ...

  renderTable: function (tableData) {
    // This function would be responsible for rendering the table in the UI.
    // It should return the HTML structure of the table, which would include the
    // necessary `scope` attribute on the <th> elements.

    // Example HTML structure with the `scope` attribute added
    return `
      <table>
        <thead>
          <tr>
            ${tableData.headers.map((header, index) => `
              <th scope="col">${header}</th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableData.rows.map(row => `
            <tr>
              ${row.map(cell => `
                <td>${cell}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  },
};