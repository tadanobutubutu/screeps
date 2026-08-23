// Address accessibility issues from insight report
// Add missing aria attributes for buttons
function addAriaAttributes(htmlContent) {
  // Add aria-controls for tables
  const tableRegex = /<table([^>]*)>/gi;
  let modifiedContent = htmlContent.replace(tableRegex, (match, attrs) => {
    const controlsId = `table_controls_${Math.floor(Math.random() * 100000)}`;
    return `<table${attrs} aria-controls="${controlsId}">`;
  });

  // Add aria-describedby for forms
  const formRegex = /<form([^>]*)>/gi;
  modifiedContent = modifiedContent.replace(formRegex, (match, attrs) => {
    const describedById = `form_desc_${Math.floor(Math.random() * 100000)}`;
    return `<form${attrs} aria-describedby="${describedById}">`;
  });

  // Add missing aria-labels, aria-labelledby
  modifiedContent = modifiedContent.replace(/<section([^>]*)>/gi, (match, attrs) => {
    if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby')) {
      const sectionLabel = `section_${Math.floor(Math.random() * 100000)}`;
      return `<section${attrs} aria-labelledby="${sectionLabel}">`;
    }
    return match;
  });

  // Add buttons with missing aria-label
  const buttonRegex = /<button([^>]*)>([^<]*)<\/button>/gi;
  modifiedContent = modifiedContent.replace(buttonRegex, (match, attrs, text) => {
    if (!attrs.includes('aria-label') && !attrs.includes('aria-labelledby') && !attrs.includes('aria-describedby')) {
      const buttonText = text.trim();
      const ariaLabel = buttonText || `Button ${Math.floor(Math.random() * 1000)}`;
      return match.replace('>', ` aria-label="${ariaLabel}">`);
    }
    return match;
  });

  // Add missing aria-expanded to toggles
  const toggleRegex = /<button([^>]*)aria-controls=["']([^"']*)["']([^>]*)>/gi;
  modifiedContent = modifiedContent.replace(toggleRegex, (match, before, controlsId, after) => {
    if (!before.includes('aria-expanded') && !after.includes('aria-expanded')) {
      return `<button${before}aria-controls="${controlsId}"${after} aria-expanded="false">`;
    }
    return match;
  });

  // Add role="img" to icons without accessible text
  const iconRegex = /<i([^>]*)class=["']([^"']*fa[^"']*)["']([^>]*)>/gi;
  modifiedContent = modifiedContent.replace(iconRegex, (match, before, classes, after) => {
    if (!before.includes('aria-label') && !after.includes('aria-label') && !classes.includes('sr-only')) {
      return `<i${before}class="${classes}"${after} aria-hidden="true">`;
    }
    return match;
  });

  return modifiedContent;
}

// Add labels to elements where necessary
function addLabels(htmlContent) {
  // Add labels to form fields
  const labelRegex = /<label([^>]*)>([^<]*)<\/label>/gi;
  let modifiedContent = htmlContent;
  let labelFound = false;
  let currentId = null;

  modifiedContent = modifiedContent.replace(labelRegex, (match, attrs, text) => {
    if (!labelFound) {
      // Label for the first form or a following label with an associated input that doesn't have a label
      labelFound = true;
      const inputRegex = new RegExp('<input[^>]*>', 'i');
      const formRegex = /<form[^>]*>/gi;

      let formMatch = formRegex.exec(modifiedContent);
      if (formMatch) {
        // Label for the first form found in the HTML
        let inputMatch = null;

        do {
          inputMatch = inputRegex.exec(modifiedContent);
          if (inputMatch) {
            const inputIdMatch = inputMatch[0].match(/id=["']([^"']*)["']/);
            if (inputIdMatch) {
              const inputId = inputIdMatch[1];
              if (inputId === currentId) {
                return match;
              }
            }
          }

          modifiedContent = modifiedContent.replace(inputMatch[0], inputMatch[0] + ' aria-label="' + text.trim() + '"');
          formMatch = formRegex.exec(modifiedContent);

        } while (formMatch);

        // If no matching input was found, use the first visible label
        if (!inputMatch) {
          return match;
        }
      } else {
        // Label after the first form or a standalone label
        currentId = getInputId(text);
      }
    }

    const forAttr = ` for="${currentId}"`;
    const idAttr = ` id="${currentId}_label"`;

    const someAttr = attrs ? attrs + ' ' : '';
    const someForAttr = someAttr && forAttr ? someAttr + forAttr : forAttr;
    const someIdAttr = someAttr && idAttr ? someAttr + idAttr : idAttr;

    const updatedLabel = `<label${someForAttr}${someIdAttr}>${text}</label>`;
    return updatedLabel === match ? match : updatedLabel;
  });

  return modifiedContent;
}

// Find the id associated with a given input label
function getInputId(labelText) {
  // Main input's label contains the input ID as a substring
  const mainInputLabelRegex = new RegExp('for=["\']([^"\']*)["\']', 'i');

  // Try finding a parent form
  const formRegex = /<form[^>]*>/gi;
  let match;
  let content;

  outerLoop:
  while ((match = formRegex.exec(mainInputLabelRegex))) {
    let formStart = match.index;
    const formEnd = match.index + match[0].length;

    content = htmlContent.substring(formStart, formEnd);

    // Look for a label within the form
    const labelRegex = /<label[^>]*>([^<]*)<\/label>/gi;
    let labelMatch;

    innerLoop:
    while ((labelMatch = labelRegex.exec(content))) {
      if (labelText.includes(labelMatch[1])) {
        // Found matching label, extract the input ID
        const matchResult = labelMatch[0].match(/for=["\']([^"\']*)["\']/);
        if (matchResult) {
          return matchResult[1];
        }

        // Move the index to the end of the last found label
        const labelEnd = labelMatch.index + labelMatch[0].length;
        continue outerLoop;
      }
    }

    // If we didn't find a label, move to the next form
    modifiedContent = modifiedContent.replace(formRegex, '');
  }

  // If no inputs are found, return a fallback ID
  return 'input_label';
}

// Export the new functions
export { addAriaAttributes, getInputId, addLabels };