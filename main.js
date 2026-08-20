// Example of how the main.js might be modified to fix the issue
// This is a generic example and may not reflect the actual structure of your main.js file

// ... existing code ...

// Assuming the following is part of your main.js file where the table is defined
const tableHTML = `
  <table>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
        <th scope="col">Header 3</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Data 1</td>
        <td>Data 2</td>
        <td>Data 3</td>
      </tr>
      <!-- More rows -->
    </tbody>
  </table>
`;

// ... existing code ...

// Replace the tableHTML with the updated version if it's stored in a variable
// Or if it's directly written to the DOM, ensure the `<th>` tags have the `scope` attribute
document.getElementById('your-table-id').innerHTML = tableHTML;

// ... existing code ...