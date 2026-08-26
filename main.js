// Import the necessary functions to read files and check for the presence of the scope attribute
const fs = require('fs');
const path = require('path');

// Function to check if all <th> elements have the scope attribute
function checkThScopeAttribute(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const thElements = fileContent.match(/<th\b[^>]*>/g);
  if (!thElements) {
    return true; // No <th> elements found, so no issue
  }

  const hasNoScope = thElements.some((th) => {
    return !th.includes('scope="');
  });

  return !hasNoScope;
}

// Function to test the presence of the scope attribute in all <th> elements
function testThScopeAttribute() {
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');
  const hasScopeAttribute = checkThScopeAttribute(filePath);

  if (!hasScopeAttribute) {
    throw new Error('Not all <th> elements have the scope attribute.');
  }

  console.log('All <th> elements have the scope attribute.');
}

// Run the test
testThScopeAttribute();