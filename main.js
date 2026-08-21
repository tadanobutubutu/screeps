// Existing code and exports preserved...

function fixTableStructure() {
  const filesAffected = [
    'docs/dependency-graph.html'
  ];

  filesAffected.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const updatedContent = content.replace(/<th>/g, '<th scope="col">');
    fs.writeFileSync(file, updatedContent);
  });
}

// Call the function to fix the table structure
fixTableStructure();

// ... rest of the main.js code