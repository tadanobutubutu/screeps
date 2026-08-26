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

// Skip navigation link for keyboard users

// Main functional component
const Main = ({ data }) => {
  // Address critical issue: React Language Attribute
  // Wrap all child nodes in a top-level Lang tag
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>My App</title>
      </head>
      <body>
        <div>
          {/* Wrap the existing table in a more accessible Table structure */}
          <Table data={data}>
            {/* Address warning issue: React Fake Link */}
            {/* Use Link component from next/link or react-router-dom instead of regular a tags for navigation */}
            {/* ... existing table structure (adjust as needed) ... */}
          </Table>
        </div>
      </body>
    </html>
  );
};