// Replace the <a> tag with a <button> tag
document.getElementById('unrotate').outerHTML = `
  <button id="unrotate">rotate back</button>
`;

// Add SVG accessible name fix
const svgElement = document.querySelector('svg');
if (svgElement) {
  const description = document.createElement('description');
  description.id = 'accessible-svg-description';
  description.textContent = 'Accessible description of SVG content';
  svgElement.insertBefore(description, svgElement.firstChild);
  svgElement.setAttribute('aria-label', 'Accessible description of SVG content');
}

// The following is a placeholder for the actual occurrences of <th> without scope
// Replace the following line with the actual code block where <th> elements are defined
// For example, if <th> elements are defined in a table, it would look like this:
// <table>
// <thead>
// <tr>
// <th scope="col">Header 1</th>
// <th scope="col">Header 2</th>
// </tr>
// </thead>
// <tbody>
// <!-- Table rows with data cells -->
// </tbody>
// </table>
// Example of adding scope to a single <th> element
// <th scope="col">Header 1</th>
// ... (the rest of the code that includes the updated <th> elements) ...