const fs = require('fs');

// Hypothetical before and after code snippet for Dashboard.tsx

// Combining both changes, ensure both sections are within the main tag and consolidate the duplicate main tag
// <main>
//   <!-- Existing content -->
//   <section id="existing-content">
//     <!-- Existing content -->
//   </section>
//   <section id="additional-content">
//     <!-- Additional content that was previously in a separate main -->
//   </section>
// </main>

function addScopeToTh(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<th scope="col"><div>(.*?)<\/div>\s*<\/th>/g, '<th scope="col"><div>$1</div><th>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added scope attribute to 'th' elements in ${filePath}`);
}

function addLangAttribute(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Check if <html> tag exists and does not have a lang attribute
  if (content.includes('<html') && !content.includes('<html lang')) {
    const updatedContent = content.replace(/<html>/i, '<html lang="en"');
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Added lang="en" to ${filePath}`);
  } else {
    console.log(`lang attribute already present or no <html> tag found in ${filePath}`);
  }
}

// Usage
addScopeToTh('docs/dependency-graph.html');
addLangAttribute('docs/dependency-graph.html');