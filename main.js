// This is just an example. The actual HTML content should be updated directly in the affected HTML files.

const tableContent = `
  <table>
    <thead>
      <tr>
        <th scope="col">Column 1</th>
        <th scope="col">Column 2</th>
        <th scope="col">Column 3</th>
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

document.getElementById('table-container').innerHTML = tableContent;