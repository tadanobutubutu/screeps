const fs = require('fs');

function updateHtmlLanguageAttribute(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the file:', err);
      return;
    }

    // Check if lang attribute already exists
    if (/<html\s+lang=["'][^"']*["']/i.test(data)) {
      // Replace existing lang attribute with lang="en"
      const updatedData = data.replace(/<html\s+lang=["'][^"']*["']/i, '<html lang="en"');
      writeFileWithLang(filePath, updatedData, data);
    } else if (/<html>/i.test(data)) {
      // Replace the existing <html> tag with the updated one (add lang attribute)
      const updatedData = data.replace(/<html>/i, '<html lang="en">');
      writeFileWithLang(filePath, updatedData, data);
    } else if (/<html\s+[^>]*>/i.test(data)) {
      // Replace <html> tag that has other attributes but no lang
      const updatedData = data.replace(/<html(\s+[^>]*)?>/i, (match, attrs) => {
        if (attrs) {
          return `<html lang="en"${attrs}>`;
        }
        return '<html lang="en">';
      });
      writeFileWithLang(filePath, updatedData, data);
    } else {
      console.log('No <html> tag found in the file.');
    }
  });
}

function writeFileWithLang(filePath, updatedData, originalData) {
  if (updatedData === originalData) {
    console.log('No changes needed - lang attribute already present.');
    return;
  }

  fs.writeFile(filePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing the file:', err);
      return;
    }
    console.log('The file has been updated successfully.');
  });
}

// Assuming the path to the HTML file is known
const htmlFilePath = process.argv[2] || 'index.html';

// Call the function to update the file
updateHtmlLanguageAttribute(htmlFilePath);