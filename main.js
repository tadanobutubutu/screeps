// [Your existing code remains unchanged until the table section]

// Example of how to fix the table structure (this is just an example - you'll need to apply similar fixes to all 26 occurrences)
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
  </tbody>
</table>
`;

// [Rest of your existing code remains unchanged]

// For the specific files mentioned in the issue (dependency-graph.html), you would need to modify them similarly:
// For example, change:
// <th><div>src/constants.js</div></th>
// to:
// <th scope="col"><div>src/constants.js</div></th>

// And apply the same pattern to all other <th> elements in the HTML files that are mentioned in the issue.

// Note: Since we can't see the complete content of your main.js file, I've shown the general pattern.
// You'll need to apply these changes to all 26 occurrences in your actual files.