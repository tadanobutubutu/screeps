// Existing code from main.js, preserved
// ...

// New changes requested in the issue
// Wrap the primary content in <main> where necessary

// For dashboard/app/layout.tsx
// Add a <main> tag around the primary content
const mainContent = document.querySelector('.flex-1');
if (mainContent) {
  mainContent.innerHTML = `<main>${mainContent.innerHTML}</main>`;
}

// For app/layout.tsx
// Add a <main> tag around the primary content
const appMainContent = document.querySelector('main');
if (appMainContent) {
  appMainContent.outerHTML = `<main>${appMainContent.outerHTML}</main>`;
}

// For docs/dependency-graph.html
// Add a <main> tag around the table
const tableContent = document.querySelector('table');
if (tableContent) {
  tableContent.parentElement.innerHTML = `<main>${tableContent.parentElement.innerHTML}</main>`;
}

// For docs/index.html
// Add a <main> tag around the primary content
const indexMainContent = document.querySelector('.container');
if (indexMainContent) {
  indexMainContent.parentElement.innerHTML = `<main>${indexMainContent.parentElement.innerHTML}</main>`;
}

// Existing code from main.js, preserved
// ...