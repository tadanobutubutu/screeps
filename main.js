// Hypothetical main.js code snippet
function generateTableHeader(headerContent) {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  headerContent.forEach((content) => {
    const th = document.createElement('th');
    th.textContent = content;
    th.setAttribute('scope', 'col'); // Add the scope attribute here
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  return thead;
}

// Usage example:
const headers = ['Header 1', 'Header 2', 'Header 3'];
const tableHeader = generateTableHeader(headers);
document.getElementById('myTable').appendChild(tableHeader);