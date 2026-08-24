// Existing code and functions from main.js (before conflict markers)

// <<<<<<< HEAD
function fetchData() {
  // Existing code to fetch data
}

function processData(data) {
  // Existing code to process data
}

function renderTable(tableData) {
  // Existing code to render the table
}

// ========

// Code that needs to be added or modified according to the issue

// Wrap the primary content in <main> for accessibility

// >>>>>>> origin/main

function getMainContent() {
  return `
    <main>
      <h1>Page Title</h1>
      <p>Page description...</p>
      ${fetchData()}
      ${processData(fetchData())}
      ${renderTable(fetchData())}
    </main>
  `;
}

// Ensure that the getMainContent function is called and its output is used
// where the main content is supposed to be rendered in the component.

export { getMainContent };