// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or changes requested in the issue to wrap the primary content in <main>
// Assuming the primary content is the main data table or the main content area, respectively

// For docs/dependency-graph.html
const originalDependencyGraphContent = document.getElementById('table-rotated').innerHTML;
document.getElementById('table-rotated').parentNode.innerHTML = `
  <main>
    ${originalDependencyGraphContent}
  </main>
`;

// For docs/index.html
const originalIndexContent = document.querySelector('.container').innerHTML;
document.querySelector('.container').parentNode.innerHTML = `
  <main>
    ${originalIndexContent}
  </main>
`;

// ... (Preserve the rest of the code)