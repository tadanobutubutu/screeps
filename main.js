Here's the resolved `main.js` file with both changes integrated:

```javascript
// TODO: This is the existing code that needs to be preserved
// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_027: Fix 26 table structure issues
// REACT_017: Add/fix 4 landmark issues
// REACT_041: Add accessible names to 2 SVGs
// REACT_025: Ensure unique landmarks (2 issues) — (DONE: ensureUniqueLandmarks)
// REACT_036: Fix 1 fake link issue
// ADD: Address new accessibility issues from insight report — FIXED
// REACT_042: Create accessible form for adding a new book

// TODO: This is the existing code that needs to be preserved

// ... (Existing functions and imports remain the same)

// New function to create accessible form for adding a new book
/**
 * Creates an accessible form for adding a new book with proper labels and ARIA attributes
 * @param {string} formId - The ID for the form element
 * @param {string} submitButtonId - The ID for the submit button
 * @returns {HTMLFormElement} The created form element
 */
function createAccessibleBookForm(formId, submitButtonId) {
    const form = document.createElement('form');
    form.id = formId;
    form.setAttribute('role', 'form');
    form.setAttribute('aria-labelledby', `${formId}-title`);

    // Add form title for accessibility
    const title = document.createElement('h2');
    title.id = `${formId}-title`;
    title.textContent = 'Add New Book';
    form.appendChild(title);

    // Create accessible form fields
    const createField = (labelText, inputId, inputType = 'text') => {
        const fieldset = document.createElement('fieldset');
        const label = document.createElement('label');
        label.setAttribute('for', inputId);
        label.textContent = labelText;
        const input = document.createElement('input');
        input.type = inputType;
        input.id = inputId;
        input.setAttribute('required', 'true');
        input.setAttribute('aria-required', 'true');

        fieldset.appendChild(label);
        fieldset.appendChild(input);
        return fieldset;
    };

    // Add form fields
    form.appendChild(createField('Book Title:', `${formId}-title`));
    form.appendChild(createField('Author:', `${formId}-author`));
    form.appendChild(createField('Publication Year:', `${formId}-year`, 'number'));

    // Add submit button
    const submitButton = document.createElement('button');
    submitButton.id = submitButtonId;
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit new book form');
    form.appendChild(submitButton);

    return form;
}

// ... (Existing functions and exports remain the same)
```