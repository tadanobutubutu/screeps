// Hypothetical snippet from main.js where the HTML is included
const tableContent = `
  <table>
    <thead>
      <tr>
        <th><div>src/constants.js</div></th>
        <th><div>src/managers/roomManager.js</div></th>
        <th><div>src/managers/spawnManager.js</div></th>
        <!-- ... other headers ... -->
      </tr>
    </thead>
    <tbody>
      <!-- ... table rows ... -->
    </tbody>
  </table>
`;

// Updated table content with the scope attribute added to each <th>
const updatedTableContent = tableContent.replace(/<th>(.*?)<\/th>/g, '<th scope="col">$1</th>');

// You would then use updatedTableContent in your React component or server-side rendering