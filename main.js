// Hypothetical before and after code snippet for Dashboard.tsx

// Before:
// <main>
//   <!-- Existing content -->
// </main>
// <main>
//   <!-- Additional content that should not be in a separate main -->
// </main>

// After:
// <main>
//   <!-- Existing content -->
//   <section>
//     <!-- Additional content that was previously in a separate main -->
//   </section>
// </main>

const fs = require('fs');

function addScopeToTh(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Change the anchor tag to a button for better accessibility
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Check if <html> tag exists and does not have a lang attribute
  if (content.includes('<html') && !content.includes('<html lang')) {
    const updatedContent = content.replace(/<html/i, '<html lang="en"');
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Added lang="en" to ${filePath}`);
  } else {
    console.log(`lang attribute already present or no <html> tag found in ${filePath}`);
  }
}

addScopeToTh('docs/dependency-graph.html');
addLangAttribute('docs/dependency-graph.html');