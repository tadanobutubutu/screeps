// Assuming this is part of main.js where the HTML table is defined

const tableContent = `
  <table>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
        <!-- Add scope="col" to all header cells -->
        <th scope="col">Header 3</th>
      </tr>
    </thead>
    <tbody>
      <!-- Table rows here -->
    </tbody>
  </table>
`;

// Output the updated HTML content to the page or a file
document.body.innerHTML = tableContent;