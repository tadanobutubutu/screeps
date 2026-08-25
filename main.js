// New function: Render dependency graph content
function renderDependencyGraphContent(data) {
  // Replace the existing content within the dependencyGraph div using the provided data.
  document.querySelector('#dependencyGraph .dependencyGraph').innerHTML = data;
}