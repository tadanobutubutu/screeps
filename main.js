// Assuming main.js contains HTML content and the following is a snippet of it

const htmlContent = `
  <table>
    <thead>
      <tr>
        <th scope="col"><div>src/constants.js</div></th>
        <th scope="col"><div>src/managers/roomManager.js</div></th>
        <th scope="col"><div>src/managers/spawnManager.js</div></th>
        <th scope="col"><div>src/managers/towerManager.js</div></th>
        <!-- ... other <th> elements ... -->
      </tr>
    </thead>
    <tbody>
      <!-- ... table rows ... -->
    </tbody>
  </table>
`;

// The rest of your JavaScript code would go here...

// If main.js is used to serve HTML, you might have something like this:

app.get('/', (req, res) => {
  res.send(htmlContent);
});

// Or if main.js is part of a larger application, you might be including the HTML content in a way like this:

// Include the HTML content in your JavaScript code
module.exports = {
  htmlContent: htmlContent,
  // ... other exports ...
};