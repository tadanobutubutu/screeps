const fs = require('fs');

function fixFakeLinkIssue(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/<a id="unrotate" href="#">rotate back<\/a>/g, '<button id="unrotate" aria-label="rotate back">rotate back</button>');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Changed anchor tag to button for better accessibility in ${filePath}`);
}

// NEW FUNCTION: Addresses the accessibility issue for the 'a' tag with empty href attribute
function fixEmptyAriaHref(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content.replace(/<a .+?aria-*="[^"]*"[^>]*><\/a>/g, '');
  // Remove any empty 'a' tags with at least one aria attribute
  updatedContent = updatedContent.replace(/<a[^>]*>/, '<a href="#" aria-hidden="true">');
  // Add a default 'aria-label' for the remaining 'a' tags
  updatedContent = updatedContent.replace(/<a([^>]*)>/, '<a $1 aria-label="link">');
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added default aria-label for empty 'a' tags for better accessibility in ${filePath}`);
}

// ... (Keep the rest of the functions as they are)

module.exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixEmptyAriaHref  // Add the new function here
};