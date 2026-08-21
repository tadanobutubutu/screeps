// Assuming the following is a snippet of the `main.js` content that needs to be updated:

// Before:
// <th><div>src/constants.js</div></th>

// After:
// <th scope="col"><div>src/constants.js</div></th>

// You would need to apply this change to all occurrences of `<th>` elements in the `docs/dependency-graph.html` file.

// Example of applying the change to all occurrences in the file:
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'docs/dependency-graph.html');
const fileContent = fs.readFileSync(filePath, 'utf8');

const updatedContent = fileContent.replace(/<th><div>(.*?)<\/div><\/th>/g, '<th scope="col"><div>$1</div></th>');

fs.writeFileSync(filePath, updatedContent);