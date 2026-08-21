function renderTable(data) {
  let html = `<html lang="en">
  <body>
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
          <th scope="col">Header 3</th>
        </tr>
      </thead>
      <tbody>`;
  
  data.forEach(row => {
    html += `<tr>`;
    row.forEach((cell, index) => {
      if (index === 0) {
        html += `<th scope="row">${cell}</th>`;
      } else {
        html += `<td>${cell}</td>`;
      }
    });
    html += `</tr>`;
  });
  
  html += `</tbody>
    </table>
  </body>
</html>`;
  
  return html;
}

function fixSVGAccessibility(element) {
  const svgElements = element.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.getAttribute('aria-label')) {
      svg.setAttribute('aria-label', 'Accessible description of the SVG content');
    }
  });
  return element;
}

module.exports = { renderTable, fixSVGAccessibility };