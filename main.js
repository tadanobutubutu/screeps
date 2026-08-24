// Existing code in main.js remains unchanged

// Below is the addition of the new scope attributes for the <th> elements in docs/dependency-graph.html
const dependencyGraphHTML = `
// Existing content in docs/dependency-graph.html

<table id="dependency-graph-table">
  <!-- table headers -->
  <thead>
    <tr>
      <th scope="col"></th>
      <th scope="col">Class/Role</th>
      <th scope="col">Type</th>
      <th scope="col">Scope</th>
      <th scope="col">Exports</th>
    </tr>
  </thead>

  <!-- table rows -->
  <tbody>
    <!-- existing table rows -->

    <tr>
      <!-- existing table cell content -->
      <th scope="col"><div>src/constants.js</div></th>
      <!-- existing table cell content -->
    </tr>

    <!-- 25 further occurrences of tables rows with the added scope attribute -->

  </tbody>
</table>

// Existing content after docs/dependency-graph.html continues
`;

module.exports = {
  code: "dependencyGraphHTML",
  scope: "global",
  generator: () => {
    return dependencyGraphHTML;
  },
};