// Assuming you have a function like this in main.js that generates the HTML content:
function generateHTMLContent() {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Document</title>
      </head>
      <body>
        <!-- Content goes here -->
      </body>
    </html>
  `;
}

// Update the function to include the lang attribute:
function generateHTMLContentWithLang() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Document</title>
      </head>
      <body>
        <!-- Content goes here -->
      </body>
    </html>
  `;
}

// If this function is part of a module, you should update the export as well:
module.exports = {
  generateHTMLContentWithLang: generateHTMLContentWithLang,
  // ... any other exports
};