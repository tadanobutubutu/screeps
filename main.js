// Example of how to fix the issue in main.js
// This is a hypothetical example and not the actual content of your main.js file.

// Original HTML content (not the actual code, just an example)
/*
<th><div>src/constants.js</div></th>
*/

// Updated HTML content with the scope attribute added
/*
<th scope="col"><div>src/constants.js</div></th>
*/

// Hypothetical main.js content with the updated HTML
const renderTable = () => {
  return `
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <th scope="col"><div>src/managers/spawnManager.js</div></th>
          <!-- ... other headers ... -->
        </tr>
      </thead>
      <tbody>
        <!-- ... table rows ... -->
      </tbody>
    </table>
  `;
};

// The rest of your main.js file would remain unchanged.