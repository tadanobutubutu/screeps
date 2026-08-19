// Existing code and exports from main.js
// ...

// New changes requested in the issue
const addScopeToTableHeaders = () => {
  const filesAffected = [
    'docs/dependency-graph.html'
  ];

  filesAffected.forEach(file => {
    const fileContent = fs.readFileSync(file, 'utf8');
    const updatedContent = fileContent.replace(/<th>/g, '<th scope="col">');
    fs.writeFileSync(file, updatedContent);
  });
};

// Call the function to update the files
addScopeToTableHeaders();

// Rest of the main.js code
// ...