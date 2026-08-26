// TODO: Address accessibility issues from insight report — FIXED
// TODO: Add new function to add role and aria-label to input type="radio" for better accessibility
const fs = require('fs');

function fixFakeLinkIssue(filePath) {
  // ... existing code ...
}

function addAriaAttribute(filePath) {
  // ... existing code ...
}

function addLangAttribute(filePath) {
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

// NEW FUNCTION: addRoleAndLabelToRadio
function addRoleAndLabelToRadio(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let updatedContent = content;

  const radios = content.match(/<input type="radio"/g);
  if (radios) {
    radios.forEach((radio) => {
      updatedContent = updatedContent.replace(
        radio,
        radio.replace('<input', '<input role="radio" aria-label="radio"')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added role and aria-label to radios for better accessibility in ${filePath}`);
}

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

  const radios = content.match(/<input type="radio"/g);
  if (radios) {
    radios.forEach((radio) => {
      updatedContent = updatedContent.replace(
        radio,
        radio.replace('<input', '<input role="radio" aria-label="radio"')
      );
    });
  }

  fs.writeFileSync(filePath, updatedContent);
  console.log(`Added role and label to checkboxes and radios for better accessibility in ${filePath}`);
}

module.exports = {
  fixFakeLinkIssue,
  addAriaAttribute,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  addRoleAndLabelToCheckbox,
  addRoleAndLabelToRadio,
};