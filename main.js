// Assuming `main.js` contains HTML table markup similar to the following:

// Before changes:
/*
<table>
  <thead>
    <tr>
      <th><div>src/constants.js</div></th>
      <th><div>src/managers/roomManager.js</div></th>
      <!-- More header cells -->
    </tr>
  </thead>
  <tbody>
    <!-- Table rows with data cells -->
  </tbody>
</table>
*/

// After changes (add `scope="col"` to each <th> element):
/*
<table>
  <thead>
    <tr>
      <th scope="col"><div>src/constants.js</div></th>
      <th scope="col"><div>src/managers/roomManager.js</div></th>
      <!-- More header cells with scope="col" -->
    </tr>
  </thead>
  <tbody>
    <!-- Table rows with data cells -->
  </tbody>
</table>
*/