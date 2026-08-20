// Example of how main.js might look if it's generating HTML content
const generateTableHTML = () => {
  const headers = [
    { name: 'src/constants.js' },
    { name: 'src/managers/roomManager.js' },
    // ... other headers
    { name: 'src/newManager1.js', addedBy: 'UserA' }, // Since both sides have added new headers, keep both.
    { name: 'src/newManager2.js', addedBy: 'UserB' }, // ... and both.
  ];

  return `
    <table>
      <caption class="sr-only">Project files and managers overview</caption>
      <thead>
        <tr>
          ${headers.map((header, index) => `<th scope="col">${header.name}</th>`).join('')}
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