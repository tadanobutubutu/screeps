// Existing code from main.js
// ...

// Add the new function or changes requested in the issue
function fixTableStructure() {
  const files = require('fs').readdirSync('./docs');
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const content = require('fs').readFileSync(`./docs/${file}`, 'utf8');
      const updatedContent = content.replace(/<th>/g, '<th scope="col">');
      require('fs').writeFileSync(`./docs/${file}`, updatedContent, 'utf8');
    }
  });
}

// Call the function to fix the table structure
fixTableStructure();

// Continue with the rest of the main.js code
// ...