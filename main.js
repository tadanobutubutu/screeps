// Address accessibility issues from insight report: replace my-button with actual button id

function fixFakeLinkIssue(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Replace anchor tags with my-button class/attribute with proper buttons
  const fakeButtons = content.match(/<a [^>]*my-button[^>]*>/gi);
  if (fakeButtons) {
    fakeButtons.forEach((button) => {
      const newButton = button
        .replace(/<a /i, '<button type="button" ')
        .replace(/<\/a>/i, '</button>');
      updatedContent = updatedContent.replace(button, newButton);
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Fixed fake link issue (my-button) for better accessibility in ${filePath}`);
}

function addAriaAttribute(filePath) {
  // ... existing code ...
}

function addLangAttribute(filePath, lang) {
  // ... existing code ...
}

function fixTableStructure(filePath) {
  // ... existing code ...
}

function addMainLandmark(filePath) {
  // ... existing code ...
}

function ensureUniqueLandmarks(filePath) {
  // ... existing code ...
}

function addSvgAccessibleNames(filePath) {
  // ... existing code ...
}

function ensureButtonAccessibility(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const checkboxes = content.match(/<input type="checkbox"/g);
  if (checkboxes) {
    checkboxes.forEach((checkbox) => {
      updatedContent = updatedContent.replace(
        checkbox,
        checkbox + ' role="checkbox" aria-label="checkbox"'
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added role and label to checkboxes for better accessibility in ${filePath}`);
}

// Address accessibility issues
function addressAccessibilityIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  // Example of a simple check for empty `alt` attribute in images
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

  // Example of adding `aria-label` to buttons
  const buttons = content.match(/<button [^>]*>/g);
  if (buttons) {
    buttons.forEach((button) => {
      updatedContent = updatedContent.replace(
        button,
        button.replace('<button', '<button aria-label="Button description"')
      );
    });
  }

  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);
  console.log(`Improved accessibility in ${filePath}`);
}

// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

module.exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  ensureButtonAccessibility,
  addressAccessibilityIssues,
  setLanguage,
};