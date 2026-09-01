// main.js

// Existing code (preserved as-is)
function addBook(title, author) {
  // TODO: Implement the required changes to improve accessibility for the addBook function or form
  const book = { title, author, id: Date.now() };
  return book;
}

// Add accessibility improvements
function addBookAccessible(title, author) {
  // Create a book object with accessibility attributes
  const book = {
    title,
    author,
    id: Date.now(),
    'aria-label': `Book: ${title} by ${author}`,
    role: 'listitem'
  };

  // Additional accessibility attributes could be added here
  // For example, if this were part of a form:
  // input.setAttribute('aria-required', 'true');

  return book;
}

// Preserve all existing exports
module.exports = {
  addBook,
  addBookAccessible // New accessible version
};