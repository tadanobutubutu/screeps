// main.js

// Import test helper function
const { updateThScopeAttribute } = require('./testHelper');

// Game loop function
function run() {
  // Your game logic here...

  // Update scope attributes in all .html files in the views directory
  const viewsDir = path.join(__dirname, 'views');
  fs.readdirSync(viewsDir)
    .filter(file => file.endsWith('.html'))
    .forEach(file => {
      const filePath = path.join(viewsDir, file);
      updateThScopeAttribute(filePath);
    });
}

// Start the game loop
Module.onInit = function() {
  setInterval(run, 1000);
};
```

This version of the file combines both changes. The first change (HEAD) added a test helper function to update the `<th>` scope attribute in a JavaScript file (`testHelper.js`). The second change (origin/main) incorporated the game logic that uses this test helper function to update the `<th>` scope attributes in all `.html` files in the `views` directory, which was not present in the first change.