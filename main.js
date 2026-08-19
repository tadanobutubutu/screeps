// ... (preserve all existing code before the table generation)

function generateDependencyGraphHTML() {
  // ... (preserve existing code in this function)

  // When generating table headers, ensure scope is added
  const headers = [
    { text: 'src/constants.js', scope: 'col' },
    { text: 'src/managers/roomManager.js', scope: 'col' },
    { text: 'src/managers/spawnManager.js', scope: 'col' },
    { text: 'src/managers/towerManager.js', scope: 'col' },
    { text: 'src/roles/builder.js', scope: 'col' },
    // Add all other headers with scope
  ];

  // Generate the table headers with proper scope attributes
  let tableHeaders = '';
  headers.forEach(header => {
    tableHeaders += `<th scope="${header.scope}"><div>${header.text}</div></th>\n`;
  });

  // ... (rest of the function that uses tableHeaders)

  // Return the complete HTML
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Dependency Graph</title>
        <style>
          /* Preserve existing styles */
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${tableHeaders}
            </tr>
          </thead>
          <tbody>
            <!-- Table body content -->
          </tbody>
        </table>
      </body>
    </html>
  `;
}

// ... (preserve all remaining existing code)