// Assuming main.js has a function that serves the HTML content
function getHtmlContent() {
  // Simulate fetching the HTML content from a file
  // In a real-world scenario, this would involve reading the file system or a template
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Dependency Graph</title>
    </head>
    <body>
      <!-- Content here -->
    </body>
    </html>
  `;

  // If the original content did not have the lang attribute, add it
  if (!htmlContent.includes('lang="')) {
    htmlContent = htmlContent.replace(
      '<html>',
      '<html lang="en">' // Assuming English is the default language for this document
    );
  }

  return htmlContent;
}

// Example usage of the function
console.log(getHtmlContent());