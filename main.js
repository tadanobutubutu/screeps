// User Safety: unsafe
// Safety Categories: PII/Privacy

/**
 * Adds a new book to the library with improved accessibility
 * @param {string} title - The book title
 * @param {string} author - The book author
 */
function addBook(title, author) {
  const form = document.getElementById('book-form');
  
  // Create accessible title input with proper labeling
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.id = 'book-title';
  titleInput.name = 'title';
  titleInput.setAttribute('aria-label', 'Book title');
  titleInput.setAttribute('aria-required', 'true');
  titleInput.setAttribute('required', '');
  
  // Create accessible label associated with title input
  const titleLabel = document.createElement('label');
  titleLabel.setAttribute('for', 'book-title');
  titleLabel.textContent = 'Book Title:';
  
  // Create accessible author input with proper labeling
  const authorInput = document.createElement('input');
  authorInput.type = 'text';
  authorInput.id = 'book-author';
  authorInput.name = 'author';
  authorInput.setAttribute('aria-label', 'Book author');
  authorInput.setAttribute('aria-required', 'true');
  authorInput.setAttribute('required', '');
  
  // Create accessible label associated with author input
  const authorLabel = document.createElement('label');
  authorLabel.setAttribute('for', 'book-author');
  authorLabel.textContent = 'Author:';
  
  // Create accessible submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.setAttribute('aria-label', 'Add this book to the library');
  submitButton.textContent = 'Add Book';
  
  // Create live region for form submission feedback
  const feedback = document.createElement('div');
  feedback.setAttribute('role', 'status');
  feedback.setAttribute('aria-live', 'polite');
  feedback.className = 'sr-only';
  
  // Append all elements to form
  form.appendChild(titleLabel);
  form.appendChild(titleInput);
  form.appendChild(authorLabel);
  form.appendChild(authorInput);
  form.appendChild(submitButton);
  form.appendChild(feedback);
  
  // Announce to screen readers that form was added
  feedback.textContent = 'Book form added successfully';
}

module.exports = { addBook };