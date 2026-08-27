function addRoleAndLabelToCheckbox(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const checkboxes = content.match(/<input type="checkbox"/g);
  if (checkboxes) {
    checkboxes.forEach((checkbox) => {
      updatedContent = updatedContent.replace(
        checkbox,
        checkbox.replace('<input', '<input role="checkbox" aria-label="checkbox"')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added role and label to checkboxes for better accessibility in ${filePath}`);
}

// New function to address accessibility issues
function addressAccessibilityIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const images = content.match(/<img [^>]*>/g);
  if (images) {
    images.forEach((image) => {
      const altAttribute = image.match(/alt="([^"]*)"/);
      if (!altAttribute || altAttribute[1].trim() === '') {
        updatedContent = updatedContent.replace(
          image,
          image.replace('<img', '<img alt="Image description"')
        );
      }
    });
  }

  const buttons = content.match(/<button [^>]*>/g);
  if (buttons) {
    buttons.forEach((button) => {
      updatedContent = updatedContent.replace(
        button,
        button.replace('<button', '<button aria-label="Button description"')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Improved accessibility in ${filePath}`);
}

module.exports = {
  addRoleAndLabelToCheckbox,
  addressAccessibilityIssues,
};