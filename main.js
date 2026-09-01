// Main JavaScript File

// Initial state and dependencies
const books = [];
const safetyCategory = "User Safety: safe";

// Function to add a new book
function addBook(title, author) {
  const bookObject = { title, author };
  books.push(bookObject);

  // Accessibility improvement: Announce the addition of the book to the user
  announceBookAdded(title, author);

  return bookObject;
}

// Function to announce the addition of a book to the user (via screen reader or speech synthesis service)
function announceBookAdded(title, author) {
  console.log(`A new book has been added: "${title}" by "${author}".`);
}

// Function to get all books as a list
function getBooksList() {
  let booksList = [];

  // Iterate through the books array
  books.forEach((book, index) => {
    // Format the book data in a readable way
    booksList[index] = `${index + 1}. ${book.title} by ${book.author}`;
  });

  return booksList.join("\n");
}

// Exporting functions
export {
  addBook,
  getBooksList,
  safetyCategory,
};

// TODO: Implement the required changes to improve accessibility for getting the safety category