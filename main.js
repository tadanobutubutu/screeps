// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or change requested in the issue
// Replace the <a> tag with a <button> tag in the specific HTML file
// Assuming the main.js file contains a function that renders the HTML content
// and that the content is fetched from the `docs/dependency-graph.html` file.

// Example of a hypothetical function that might be in main.js
// This is just an example and the actual implementation may vary
function renderDependencyGraph() {
  fetch('docs/dependency-graph.html')
    .then(response => response.text())
    .then(data => {
      // Replace the <a> tag with a <button> tag
      const updatedData = data.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');

      // Assuming there's a container in the DOM to insert the updated HTML
      const container = document.getElementById('dependency-graph-container');
      container.innerHTML = updatedData;
    })
    .catch(error => console.error('Error fetching dependency graph:', error));
}

// Call the function to render the updated content
renderDependencyGraph();

// ... (Preserve all existing code, exports, and functions)