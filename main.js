// Add missing aria attributes for buttons
function addAriaAttributes(htmlContent) {
  // Add aria-controls for tables
  const tableRegex = /<table(\s[^>]*)?>/gi;
  let modifiedContent = htmlContent.replace(tableRegex, (match, attrs) => {
    const controlsId = `table_${Math.floor(Math.random() * 100000)}_controls`;
    return `<table${attrs} aria-labelledby="${controlsId}">${match[1]}</table>`;
  });

  // Add aria-describedby for forms
  const formRegex = /<form([^>]*)>/gi;
  modifiedContent = modifiedContent.replace(formRegex, (match, attrs) => {
    const describedById = `form_${Math.floor(Math.random() * 100000)}`;
    return `<form${attrs} aria-describedby="${describedById}">${match[1]}</form>`;
  });

  // Add missing aria-labels, aria-labelledby
  modifiedContent = addLabels(modifiedContent);

  // Add buttons with missing aria-label
  const buttonRegex = /<button(\s[^>]*)?>/gi;
  modifiedContent = modifiedContent.replace(buttonRegex, (match, attrs) => {
    const ariaLabel = attrs.match(/aria-label="([^"]*)"/);
    if (!ariaLabel) {
      return match.replace('>', ' aria-label="Button"');
    }
    return match;
  });

  // Add missing aria-expanded to toggles
  const toggleRegex = /<button (\s*aria-controls="[^"]*" \s+aria-expanded="false" \s+[^>]*)?>/gi;
  modifiedContent = modifiedContent.replace(toggleRegex, (match, attrs) => {
    return match.replace('aria-expanded="false"', 'aria-expanded="$1true"');
  });

  return modifiedContent;
}

// Add labels to elements where necessary
function addLabels(htmlContent) {
  // Add labels to form fields
  const labelRegex = /<label([^>]*)>(.+?)<\/label>/gi;
  let modifiedContent = htmlContent;
  let labelFound = false;
  let currentId = null;

  modifiedContent = modifiedContent.replace(labelRegex, (match, attrs, text) => {
    if (!labelFound) {
      // Label for the first form or a following label with an associated input that doesn't have a label
      labelFound = true;
      const inputRegex = new RegExp(`id="${currentId}"`, 'i');
      const formRegex = /<form[^>]*>/gi;

      let formMatch = modifiedContent.match(formRegex);
      if (formMatch) {
        // Label for the first form found in the HTML
        let inputMatch = null;

        do {
          inputMatch = modifiedContent.match(inputRegex);
          if (inputMatch) {
            const inputId = inputMatch[0].replace('"', '');
            if (inputId === currentId) {
              return match;
            }
          }

          modifiedContent = modifiedContent.substring(formMatch.index + formMatch[0].length);
          formMatch = modifiedContent.match(formRegex);

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
    const idAttr = ` id="${currentId}"`;

    const someAttr = attrs ? attrs + ' ' : '';
    const someForAttr = someAttr && forAttr ? someAttr + forAttr : forAttr;
    const someIdAttr = someAttr && idAttr ? someAttr + idAttr : idAttr;

    const updatedLabel = `<label${someForAttr}>${text}</label>${someIdAttr}`;
    return updatedLabel === match ? match : updatedLabel;
  });

  return modifiedContent;
}

// Find the id associated with a given input label
function getInputId(labelText) {
  // Main input's label contains the input ID as a substring
  const mainInputLabelRegex = new RegExp(`\\b(${labelText})\\b\\s+for\\s*=\\s*(\\w+)[^\\w\\d]`);

  // Try finding a parent form
  const formRegex = /<form[^>]*>/gi;
  let match;
  let content;

  outerLoop:
  while ((match = modifiedContent.match(formRegex))) {
    let formStart = match.index;
    const formEnd = match.index + match[0].length;

    content = modifiedContent.substring(formStart, formEnd);

    // Look for a label within the form
    const labelRegex = /<label.*?>(.+?)<\/label>/gi;
    let labelMatch;

    innerLoop:
    while ((labelMatch = labelRegex.exec(content))) {
      if (mainInputLabelRegex.test(labelMatch[1])) {
        // Found matching label, extract the input ID
        const matchResult = labelMatch[1].match(mainInputLabelRegex);
        if (matchResult) {
          return matchResult[2];
        }

        // Move the index to the end of the last found label
        const labelEnd = labelMatch.index + labelMatch[0].length;
        continue outerLoop;
      }
    }

    // If we didn't find a label, move to the next form
    modifiedContent = modifiedContent.substring(formEnd);
  }

  // If no inputs are found, return a fallback ID
  return 'input_label';
}

// Export the new functions
export { addAriaAttributes, getInputId, addLabels };