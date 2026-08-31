/**
 * Main application entry point
 */

// Import required modules
const http = require('http');
const path = require('path');

// TODO: This is the existing code that needs to be preserved

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Adds a new book to the collection with accessibility improvements
 * @param {Object} bookData - The book data to add
 * @param {string} bookData.title - The book title (required)
 * @param {string} bookData.author - The book author (required)
 * @param {string} [bookData.isbn] - The book ISBN (optional)
 * @param {string} [bookData.description] - The book description (optional)
 * @returns {Object} Result object with success status and book data or error message
 */
function addBook(bookData) {
  const errors = [];
  
  // Validate book data exists
  if (!bookData || typeof bookData !== 'object') {
    return {
      success: false,
      error: 'Book data is required and must be an object',
      accessibleError: 'Error: Book information is missing. Please provide valid book details.'
    };
  }
  
  // Validate title (required field)
  if (!bookData.title || typeof bookData.title !== 'string' || bookData.title.trim() === '') {
    errors.push('Title is required');
  }
  
  // Validate author (required field)
  if (!bookData.author || typeof bookData.author !== 'string' || bookData.author.trim() === '') {
    errors.push('Author is required');
  }
  
  // Return errors if validation failed
  if (errors.length > 0) {
    return {
      success: false,
      errors: errors,
      accessibleError: `Error: ${errors.join('. ')}. Please fill in all required fields.`
    };
  }
  
  // Create the book object with sanitized data
  const book = {
    id: Date.now(),
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    isbn: bookData.isbn ? bookData.isbn.trim() : null,
    description: bookData.description ? bookData.description.trim() : null,
    createdAt: new Date().toISOString()
  };
  
  return {
    success: true,
    book: book,
    message: 'Book added successfully',
    accessibleMessage: `Success: "${book.title}" by ${book.author} has been added to your collection.`
  };
}

/**
 * Creates and starts the HTTP server
 * @returns {http.Server} The created server instance
 */
function createServer() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', config }));
  });
  return server;
}

/**
 * Starts the application
 */
function startApp() {
  const server = createServer();
  server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
  return server;
}

// Export functions for testing
module.exports = {
  createServer,
  startApp,
  config,
  addBook
};

// Start the application if run directly
if (require.main === module) {
  startApp();
}