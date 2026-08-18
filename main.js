// main.js
// [Your existing imports and code above this point remain unchanged]

// Example of how to fix the table headers (this is just an example - you'll need to apply this to your actual table structure)
const fixedTableHeaders = `
  <table>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
        <th scope="col">Header 3</th>
      </tr>
    </thead>
    <tbody>
      <!-- Your table body content -->
    </tbody>
  </table>
`;

// [Your existing functions and exports below this point remain unchanged]

// Example of how you might use this in your code:
function renderDependencyGraph() {
  // Your existing implementation
  // When creating table headers, make sure to include scope attributes
  // For example:
  const headers = [
    { key: 'file', label: 'File', scope: 'col' },
    { key: 'dependencies', label: 'Dependencies', scope: 'col' }
  ];

  // Then when rendering:
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th scope="${header.scope}">${header.label}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <!-- Your table rows -->
      </tbody>
    </table>
  `;
}

// [Rest of your existing code remains unchanged]