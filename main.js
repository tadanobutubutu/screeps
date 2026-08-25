// Existing code and exports preserved here
// ...

// New function or changes requested in the issue
function fixTableStructure() {
  const affectedFiles = [
    'docs/dependency-graph.html'
    // ... other affected files if any
  ];

  affectedFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updatedContent = content.replace(/<th>/g, '<th scope="col">');
    fs.writeFileSync(file, updatedContent, 'utf8');
  });
}

// Ensure to call the function only if necessary, for example during a deployment or a specific command
// fixTableStructure();