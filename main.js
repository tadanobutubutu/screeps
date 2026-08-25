/**
 * Adds lang="en" to the <html> tag in docs/dependency-graph.html if missing.
 */
function addLangAttribute() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(__dirname, 'docs', 'dependency-graph.html');

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    // Check if lang attribute already exists
    if (/<html[^>]*\blang\b[^>]*>/i.test(data)) {
      console.log('lang attribute already present.');
      return;
    }

    // Add lang="en" to the <html> tag
    const updatedData = data.replace(/<html[^>]*>/i, match => {
      // If the tag ends with '>', insert before it
      if (match.endsWith('>')) {
        return match.slice(0, -1) + ' lang="en">';
      }
      return match + ' lang="en">';
    });

    fs.writeFile(filePath, updatedData, 'utf8', err => {
      if (err) {
        console.error(`Error writing file: ${err}`);
        return;
      }
      console.log('Successfully added lang="en" to <html> tag.');
    });
  });
}

module.exports = { addLangAttribute };