function getPendingUpdates() {
  return [
    { package: 'eslint', version: '^10.0.0' },
    { package: 'jest', version: '^30.0.0' },
    { package: 'typescript', version: '^7.0.0' },
    { package: 'react', version: '^19.0.0' },
  ];
}

function getUpdatedDependencyGraph() {
  const updates = getPendingUpdates();
  const graph = document.createElement('div');

  updates.forEach(update => {
    const packageDiv = document.createElement('div');
    packageDiv.innerText = `${update.package} @ ${update.version}`;
    graph.appendChild(packageDiv);
  });

  return graph;
}

module.exports = { getPendingUpdates, getUpdatedDependencyGraph };