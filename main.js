// Main application logic
// ... existing code ...

// Fix: Replace fake link with proper button
// Before: <a id="unrotate" href="#">rotate back</a>
// After: <button id="unrotate">rotate back</button>

function createRotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.textContent = 'rotate back';
  button.setAttribute('type', 'button');
  return button;
}

// Or if using innerHTML:
function getRotateButtonHTML() {
  return '<button id="unrotate" type="button">rotate back</button>';
}

// Accessibility improvements for table headers
// Scope attributes should be added to <th> elements via DOM manipulation
// rather than inserting HTML directly to avoid breaking JavaScript logic.
// Common patterns where <th scope> might be needed:
const exampleTableSnippet = `
<table>
  <thead>
    <tr>
      <th>Header 1</th>           // needs scope="col"
      <th>Header 2</th>           // needs scope="col"
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Row Header</th>         // needs scope="row"
      <td>Data</td>
    </tr>
  </tbody>
</table>
`;

// ... existing code ...