function createAccessibleBookForm (formId, submitButtonId) {
  const form = document.createElement('form')
  form.id = formId
  form.setAttribute('role', 'form')
  form.setAttribute('aria-labelledby', `${formId}-title`)

  // Add form title for accessibility
  const title = document.createElement('h2')
  title.id = `${formId}-title`
  title.textContent = 'Add New Book'
  form.appendChild(title)

  // Create accessible form fields
  const createField = (labelText, inputId, inputType = 'text') => {
    const fieldset = document.createElement('fieldset')
    const label = document.createElement('label')
    label.setAttribute('for', inputId)
    label.textContent = labelText
    const input = document.createElement('input')
    input.type = inputType
    input.id = inputId
    input.setAttribute('required', 'true')
    input.setAttribute('aria-required', 'true')

    fieldset.appendChild(label)
    fieldset.appendChild(input)
    return fieldset
  }

  // Add form fields
  form.appendChild(createField('Book Title:', `${formId}-title`))
  form.appendChild(createField('Author:', `${formId}-author`))
  form.appendChild(createField('Publication Year:', `${formId}-year`, 'number'))

  // Add submit button
  const submitButton = document.createElement('button')
  submitButton.id = submitButtonId
  submitButton.type = 'submit'
  submitButton.textContent = 'Add Book'
  submitButton.setAttribute('aria-label', 'Submit new book form')
  form.appendChild(submitButton)

  return form
}

module.exports = {
  addLangAttribute,
  fixTableStructure,
  fixLandmarks,
  addSvgAccessibleNames,
  ensureUniqueLandmarks,
  fixFakeLinks,
  applyAccessibilityFixes,
  addressAccessibilityIssues,
  createInPageButton,
  divide,
  checkLinkAccessibility,
  wrapPrimaryContentInMain,
  createAccessibleBookForm
}

if (require.main === module) {
  main()
}

// Keep both original and new export lines as they both add functionality
// export { addressAccessibilityIssues, createInPageButton, existingFunction };
// Assuming existingFunction is the name of another export in the codebase (you should replace this with its actual name)

// Preserve any existing exports here
// export { createAccessibleBookForm };
