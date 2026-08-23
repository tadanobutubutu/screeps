// ... existing code ...

function wrapMainTags(htmlContent) {
  // Check if the HTML content already has <main> tag
  const isMainTagExists = htmlContent.includes('<main>');

  if (!isMainTagExists) {
    // Wrap the content inside a <main> tag
    const container = htmlContent.match(/<(.*?)>/)[1];
    const modifiedContent = `<main lang="en">${container}</main>`;
    return modifiedContent;
  }

  return htmlContent;
}

// Export wrapMainTags function
module.exports = {
  // ... existing exports ...
  wrapMainTags
};