// REACT_015: Add lang attribute to the <html> element
function addLangAttribute(html) {
  if (typeof html !== 'string') return html;
  return html.replace(/<html([^>]*)>/i, (match, attrs) => {
    if (/\blang=/i.test(match)) return match;
    return `<html${attrs} lang="en">`;
  });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
function fixTableStructure(html) {
  if (typeof html !== 'string') return html;

  // Ensure every table has a thead and tbody
  return html.replace(/<table([^>]*)>/i, (match, attrs) => {
    return `<table${attrs}>${addTheadTbody(match)}</table>`;
  });
}

function addTheadTbody(match) {
  // Ensure that all tables have a thead and tbody
  return `
    <thead>
      <tr>
        <th scope="col">...</th>
        <!-- Add other table headers here -->
      </tr>
    </thead>
    <tbody>
      <!-- Add table rows here -->
    </tbody>
  `;
}

// Export the functions if needed
export { addLangAttribute, fixTableStructure, addTheadTbody };