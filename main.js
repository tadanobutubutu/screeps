// main.js

/**
 * Adds a book to the collection with accessibility improvements
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @param {string} isbn - The ISBN of the book
 * @returns {Object} The added book object
 */
function addBook(title, author, isbn) {
    // Validate inputs
    if (!title || !author || !isbn) {
        throw new Error('All fields (title, author, ISBN) are required');
    }

    // Create book object with accessibility attributes
    const book = {
        id: Date.now().toString(),
        title,
        author,
        isbn,
        'aria-label': `Book: ${title} by ${author}`,
        'role': 'listitem'
    };

    // In a real application, you would add this to a books array or database
    // books.push(book);

    return book;
}

/**
 * Renders the add book form with accessibility attributes
 * @returns {HTMLElement} The form element
 */
function renderAddBookForm() {
    const form = document.createElement('form');
    form.setAttribute('role', 'form');
    form.setAttribute('aria-label', 'Add a new book to your collection');

    // Title input
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'book-title');
    titleLabel.textContent = 'Book Title:';
    const titleInput = document.createElement('input');
    titleInput.id = 'book-title';
    titleInput.type = 'text';
    titleInput.required = true;
    titleInput.setAttribute('aria-required', 'true');
    titleInput.setAttribute('aria-label', 'Enter the title of the book');

    // Author input
    const authorLabel = document.createElement('label');
    authorLabel.setAttribute('for', 'book-author');
    authorLabel.textContent = 'Author:';
    const authorInput = document.createElement('input');
    authorInput.id = 'book-author';
    authorInput.type = 'text';
    authorInput.required = true;
    authorInput.setAttribute('aria-required', 'true');
    authorInput.setAttribute('aria-label', 'Enter the author of the book');

    // ISBN input
    const isbnLabel = document.createElement('label');
    isbnLabel.setAttribute('for', 'book-isbn');
    isbnLabel.textContent = 'ISBN:';
    const isbnInput = document.createElement('input');
    isbnInput.id = 'book-isbn';
    isbnInput.type = 'text';
    isbnInput.required = true;
    isbnInput.setAttribute('aria-required', 'true');
    isbnInput.setAttribute('aria-label', 'Enter the ISBN of the book');

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Add Book';
    submitButton.setAttribute('aria-label', 'Submit the form to add the book');

    // Assemble form
    form.appendChild(titleLabel);
    form.appendChild(titleInput);
    form.appendChild(authorLabel);
    form.appendChild(authorInput);
    form.appendChild(isbnLabel);
    form.appendChild(isbnInput);
    form.appendChild(submitButton);

    // Form submission handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        try {
            const title = titleInput.value;
            const author = authorInput.value;
            const isbn = isbnInput.value;
            const book = addBook(title, author, isbn);
            // In a real app, you would update the UI here
            console.log('Book added:', book);
            form.reset();
        } catch (error) {
            alert(error.message);
        }
    });

    return form;
}

// Export the functions for use in other files
export { addBook, renderAddBookForm };