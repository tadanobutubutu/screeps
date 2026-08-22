// main.js

// Add the HTML lang attribute to the root element
document.documentElement.lang = 'en';

// New function to update the document title
function updateDocumentTitle(newTitle) {
  document.title = newTitle;
}

// New function to log a message to the console
function logMessage(message) {
  console.log(message);
}

// Fix 26 table structure issues
function updateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Add or modify table elements as needed
    // For example, add a caption, ensure headers are present, etc.
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table caption';
      table.insertBefore(caption, table.firstChild);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  });
}

// Add/fix 4 landmark issues
function fixLandmarkIssues() {
  const mainElements = document.querySelectorAll('main');

  // If no main element exists, create one and wrap the primary content
  if (mainElements.length === 0) {
    const body = document.body;
    const main = document.createElement('main');

    // Move all body children into main (except script/style elements if needed)
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }

    body.appendChild(main);
  }

  // Ensure main elements have proper labeling
  mainElements.forEach((main, index) => {
    if (!main.id && !main.getAttribute('aria-label') && mainElements.length > 1) {
      main.setAttribute('aria-label', 'Main content section ' + (index + 1));
    }
  });
}

// Export required functions for testing
export {
  updateDocumentTitle,
  logMessage,
  updateTableStructure,
  fixLandmarkIssues
};

// Additions to enclose primary content in <main> tag in the affected files:

// For docs/dependency-graph.html (replace L1 with the actual line number)
function encloseInMain(html) {
  const table = html.querySelector('table');
  const main = document.createElement('main');
  main.appendChild(table);
  return main;
}

// For docs/index.html (replace L1 with the actual line number)
function encloseInMainIndex(html) {
  const main = document.createElement('main');
  main.innerHTML = html.innerHTML;
  html.innerHTML = '';
  html.appendChild(main);

  // Move all children to correct positions
  const links = main.querySelectorAll('.links a');
  main.querySelector('h2').parentNode.insertBefore(links[0], main.querySelector('h2').nextSibling);
  main.querySelector('h2').parentNode.insertBefore(links[1], main.querySelectorAll('p')[1]);
}

// Update the landing page's updateDOM function to enclose in main tag before rendering:
function updateDOM() {
  const html = document.querySelector('html');
  const parser = new DOMParser();
  const landingPage = parser.parseFromString(fetch('index.html').then(res => res.text()), 'text/html');
  encloseInMainIndex(landingPage);
  html.innerHTML = landingPage.documentElement.outerHTML;

  // ... rest of the updateDOM function
}