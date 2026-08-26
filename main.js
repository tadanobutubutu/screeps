const fs = require('fs');

// TODO: Address missing export that might have been removed — ADD CODE HERE (Preserved existing code)
const exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addAltAttribute
};

// Existing code and functions

// TODO: Address accessibility issues from insight report — FIXED (If any new issues are found, add them here)

// New function to address a new accessibility issue (For example, adding ARIA-hidden to decorative images):
function hideDecorativeImages(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const updatedContent = content.replace(/(<img[^>]*>\s+<img[^>]*\s*\/>)/g, (match, img1, img2) => {
    // Check if both images are identical (e.g., same src, alt)
    if (img1.includes(img2) && !img1.includes('aria-hidden') && !img2.includes('aria-hidden')) {
      return `<img ${img1.replace(/alt=" Description"/, 'alt="" aria-hidden="true"')}>`;
    }
    return match;
  });
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Hidden decorative images for better accessibility in ${filePath}`);
}

// Add the new function to the exports object
exports.hideDecorativeImages = hideDecorativeImages;

module.exports = exports;