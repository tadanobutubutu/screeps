// Example of how main.js might look if it's generating HTML content
const generateTableHTML = () => {
  const headers = [
    { name: 'src/constants.js' },
    { name: 'src/managers/roomManager.js' },
    // ... other headers
  ];

  return `
    <table>
      <thead>
        <tr>
          ${headers.map(header => `<th scope="col">${header.name}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        <!-- Data rows would go here -->
      </tbody>
    </table>
  `;
};

// Usage
const tableHTML = generateTableHTML();
// This would be inserted into your application's DOM or used elsewhere as needed