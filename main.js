// Assuming the `main.js` file is set up to import the HTML from `docs/dependency-graph.html`
// and then manipulate the DOM accordingly.

// Import the HTML from the file
const dependencyGraphHtml = import('./docs/dependency-graph.html');

dependencyGraphHtml.then(html => {
  const unrotateLink = html.querySelector('#unrotate');
  if (unrotateLink) {
    // Replace the anchor with a button
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    unrotateLink.parentNode.replaceChild(button, unrotateLink);
  }
});