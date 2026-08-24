// Assuming this function is responsible for rendering the content of the page
function renderPageContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Page Title</title>
      <!-- Other head elements -->
    </head>
    <body>
      <main>
        <table id="table-rotated">
          <!-- Table content here -->
        </table>
      </main>
      <!-- Other page content -->
    </body>
    </html>
  `;
}

// This function would be called to render the content to the DOM
function renderPage() {
  const content = renderPageContent();
  document.getElementById('app').innerHTML = content;
}

// Call the render function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', renderPage);