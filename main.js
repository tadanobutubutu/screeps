// TODO: Identify and update specific functions that render dependency graphs or
function renderDependencyGraph(data = []) {
  // Extract unique identifiers from input data
  const nodes = data.map(item => item.id || item.label);
  // Build edges connecting sequential items as a simple chain
  const edges = [];
  for (let i = 0; i < data.length - 1; i++) {
    edges.push({
      source: data[i].id || data[i].label,
      target: data[i + 1].id || data[i + 1].label
    });
  }
  return { nodes, edges };
}

export { renderDependencyGraph };