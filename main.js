function updateDependencyGraphHtmlWithLangAttribute() {
  // Read the existing HTML
  const rawHtml = fs.readFileSync('./docs/dependency-graph.html', 'utf8');

  // Add lang attribute to root HTML element
  const updatedHtml = rawHtml.replace(
    '<html',
    '<html lang="en"'
  );

  // Write the updated HTML back to the file
  fs.writeFileSync('./docs/dependency-graph.html', updatedHtml);
}