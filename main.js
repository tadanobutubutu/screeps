// Assuming this is a snippet from the `main.js` file where the `<th>` elements are used.

// Original HTML content with conflict markers (hypothetical):
// <<<<<<< HEAD
// <th><div>src/constants.js</div></th>
// =======
// <th>src/constants.js</th>
// >>>>>>> origin/master
// </th>

// Updated HTML content to fix the issue:
// <th scope="col"><div>src/constants.js</div></th>