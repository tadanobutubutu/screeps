// Address accessibility issues from insight report
// Add missing aria attributes for buttons
function addAriaAttributes(htmlContent) {
  // ... (existing code)

  // Add missing aria-expanded to toggles
  const toggleRegex = /<button([^>]*)aria-controls=["']([^"']*)["']([^>]*)>([^<]*)<\/button>/gi;
  modifiedContent = modifiedContent.replace(toggleRegex, (match, before, controlsId, after, text) => {
    if (!before.includes('aria-expanded') && !after.includes('aria-expanded')) {
      return `<button${before}aria-controls="${controlsId}"${after} aria-expanded="false">${text}</button>`;
    }
    return match;
  });

  // ... (existing code)
}

// Add labels to elements where necessary
function addLabels(htmlContent) {
  // ... (existing code)

  // Add labels to form controls with custom id patterns
  const customIdPatterns = {
    radio: /^checkbox_[0-9]+$/,
    checkbox: /^check_[0-9]+$/,
    submit: /^button_[0-9]+$/,
  };

  modifiedContent = modifiedContent.replace(labelRegex, (match, attrs, text) => {
    if (!labelFound) {
      // ... (existing code)
    }

    let customId = currentId;
    for (const [inputType, pattern] of Object.entries(customIdPatterns)) {
      if (customId.match(pattern) && updatedInputType === inputType) {
        customId = updatedInputId;
        break;
      }
    }

    // ... (existing code)
  });

  // ... (existing code)
}

// Find the id associated with a given input label
function getInputId(labelText) {
  // ... (existing code)

  // Special cases for custom id patterns
  if (mainInputLabelRegex.test(updatedInputId)) {
    const [, inputType] = updatedInputId.match(/\b(\w+)_[0-9]+\b/);
    for (const [type, pattern] of Object.entries(customIdPatterns)) {
      if (type === inputType) {
        labelText = labelText.replace(/\s+for=["\']([^"\']*)["\']/, '$1');
        labelText = labelText.replace(pattern, updatedInputType);
        break;
      }
    }
  }

  // ... (existing code)
}

// Add a helper function to find the input type and ID based on the label
function findInputByLabel(labelText) {
  const labelRegex = new RegExp('for=["\']([^"\']*)["\']', 'i');
  const labelMatch = labelText.match(labelRegex);
  if (!labelMatch) return null;

  const inputId = labelMatch[1];
  let content;
  let inputType = null;

  const formRegex = /<form[^>]*>/gi;
  let formMatches = formRegex.exec(htmlContent);

  while (formMatches) {
    content = htmlContent.substring(formMatches.index, formMatches.index + formMatches[0].length);

    // Look for the matching input
    const inputRegex = /<input(.*?)>/gi;
    const inputMatches = inputRegex.exec(content);
    while (inputMatches) {
      const attributes = inputMatches[0].match(/id=["\']([^"\']*)["\']/);
      if (attributes && attributes[1] === inputId) {
        inputType = inputMatches[0].match(/type=["\'](\w+)["\']/)[1];
        break;
      }
      inputMatches = inputRegex.exec(content);
    }

    if (inputType) break;

    formMatches = formRegex.exec(htmlContent);
  }

  return inputType ? { type: inputType, id: inputId } : null;
}

// Export the new functions
export { addAriaAttributes, getInputId, addLabels, findInputByLabel };