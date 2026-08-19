// ... (other code)

// Example of how you would modify the main.js to reflect the changes in the HTML file
// This is for demonstration purposes only, you would actually make these changes in the HTML file
function updateDependencyGraph() {
  const htmlContent = `
    <!DOCTYPE html>
    <table>
      <thead>
        <tr>
          <th scope="col"><div>src/constants.js</div></th>
          <th scope="col"><div>src/managers/roomManager.js</div></th>
          <!-- ... other headers ... -->
        </tr>
      </thead>
      <tbody>
        <!-- ... rows ... -->
      </tbody>
    </table>
  `;

  // This is just an example of how you might update the content in a string;
  // you would actually need to modify the HTML file directly.
  console.log(htmlContent.replace(/<th>/g, '<th scope="col">'));
}

updateDependencyGraph();

// ... (other code)