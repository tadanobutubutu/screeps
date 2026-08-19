// In your main.js file, find the section that generates the HTML table
// and modify it to include scope attributes like this:

// Example of corrected table header:
html.push(`<table>
  <thead>
    <tr>
      <th scope="col"><div>src/constants.js</div></th>
      <th scope="col"><div>src/managers/roomManager.js</div></th>
      <th scope="col"><div>src/managers/spawnManager.js</div></th>
      <th scope="col"><div>src/managers/towerManager.js</div></th>
      <th scope="col"><div>src/roles/builder.js</div></th>
      <!-- Add scope="col" to all other <th> elements -->
    </tr>
  </thead>
  <tbody>
    <!-- table body content -->
  </tbody>
</table>`);