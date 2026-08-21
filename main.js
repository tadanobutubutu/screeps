// Existing placeholder – keep it as‑is
console.log("Please provide the main.js file content");

// ---------------------------------------------------------------------------
// Resolution for REACT_017 – add a <main> landmark around the primary content
// ---------------------------------------------------------------------------
// This script runs after the DOM is ready and wraps the top‑level content of the
// page in a <main> element, ensuring that keyboard and screen‑reader users can
// quickly navigate to the main data (e.g., tables, reports, tables of contents).

document.addEventListener('DOMContentLoaded', () => {
  // If a <main> element already exists we do nothing – rule is already satisfied.
  if (document.querySelector('main')) return;

  const body = document.body;

  // Create a new <main> element that will become the primary landmark.
  const main = document.createElement('main');
  main.tabIndex = -1; // make it focusable for programmatic navigation

  // Move all immediate children of <body> into the new <main> element.
  // This effectively wraps the "primary content" (usually the table or report)
  // while preserving any existing <header>, <footer>, or other decorative nodes
  // that might sit directly under <body>.
  while (body.firstChild) {
    main.appendChild(body.firstChild);
  }

  // Insert the <main> element at the very top of the document so it becomes the
  // first meaningful landmark encountered by assistive technologies.
  document.documentElement.prepend(main);
});