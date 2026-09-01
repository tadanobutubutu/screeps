// main.js
import { initializeApp } from './firebase.js';

// Firebase initialization
const firebaseConfig = {
  apiKey: "AIzaSyBQ1JQJQJQJQJQJQJQJQJQJQJQJQJQJQ",
  authDomain: "book-tracker-12345.firebaseapp.com",
  projectId: "book-tracker-12345",
  storageBucket: "book-tracker-12345.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// DOM elements
const bookForm = document.getElementById('book-form');
const bookList = document.getElementById('book-list');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const isbnInput = document.getElementById('isbn');

// Add book function with accessibility improvements
function addBook(e) {
  e.preventDefault();

  // Get form values
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const isbn = isbnInput.value.trim();

  // Validate inputs
  if (!title || !author || !isbn) {
    alert('Please fill in all fields');
    return;
  }

  // Create book element with proper ARIA attributes
  const bookDiv = document.createElement('div');
  bookDiv.className = 'book';
  bookDiv.setAttribute('role', 'article');
  bookDiv.setAttribute('aria-label', `Book: ${title} by ${author}`);

  // Create book info with proper heading structure
  const bookInfo = document.createElement('div');
  bookInfo.className = 'book-info';

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.setAttribute('aria-label', `Title: ${title}`);

  const authorElement = document.createElement('p');
  authorElement.textContent = `Author: ${author}`;
  authorElement.setAttribute('aria-label', `Author: ${author}`);

  const isbnElement = document.createElement('p');
  isbnElement.textContent = `ISBN: ${isbn}`;
  isbnElement.setAttribute('aria-label', `ISBN: ${isbn}`);

  // Create delete button with proper ARIA attributes
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete';
  deleteBtn.textContent = 'X';
  deleteBtn.setAttribute('aria-label', `Delete book: ${title}`);
  deleteBtn.setAttribute('role', 'button');

  // Append elements
  bookInfo.appendChild(titleElement);
  bookInfo.appendChild(authorElement);
  bookInfo.appendChild(isbnElement);
  bookDiv.appendChild(bookInfo);
  bookDiv.appendChild(deleteBtn);

  // Add to book list
  bookList.appendChild(bookDiv);

  // Clear form fields
  titleInput.value = '';
  authorInput.value = '';
  isbnInput.value = '';

  // Focus on form for better keyboard navigation
  titleInput.focus();
}

// Event listeners
bookForm.addEventListener('submit', addBook);

// Delete book function
function deleteBook(e) {
  if (e.target.classList.contains('delete')) {
    if (confirm('Are you sure you want to delete this book?')) {
      e.target.parentElement.remove();
    }
  }
}

// Event listener for delete
bookList.addEventListener('click', deleteBook);

// Initialize the app
function initializeApp() {
  // Any initialization code can go here
}

// Export functions if needed
export { addBook, deleteBook, initializeApp };

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// Added proper ARIA attributes, semantic HTML structure, and keyboard navigation improvements