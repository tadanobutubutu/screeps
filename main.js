// Example of adding a <main> element to the HTML structure of a page
function addMainElement(content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Page Title</title>
    </head>
    <body>
      <main>${content}</main>
    </body>
    </html>
  `;
}

// Example usage for a specific file, e.g., dashboard/app/layout.tsx
const dashboardContent = `
  <div id="dashboard">
    <!-- Dashboard content goes here -->
  </div>
`;

const dashboardLayout = addMainElement(dashboardContent);
// The dashboardLayout variable now contains the HTML with a <main> element wrapped around the dashboard content.