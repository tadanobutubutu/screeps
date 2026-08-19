function getPendingUpdates() {
  return [
    { package: 'eslint', version: '^10.0.0' },
    { package: 'jest', version: '^30.0.0' },
    { package: 'typescript', version: '^7.0.0' },
    { package: 'react', version: '^19.0.0' },
  ];
}

function fixTableHeaders() {
  // This function would be used to modify the HTML file
  // In a real implementation, this would read and modify dependency-graph.html
  // For this example, we're just preserving the existing JavaScript code
  console.log('Table headers would be fixed with scope attributes');
}

module.exports = { getPendingUpdates, fixTableHeaders };