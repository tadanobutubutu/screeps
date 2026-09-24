// ... (preserve all existing code above line 238)

/**
 * Adds a new book to the library with accessibility improvements
 * @param {string} title - The title of the book
 * @param {string} author - The author of the book
 * @param {number} pages - The number of pages
 * @param {boolean} read - Whether the book has been read
 */
function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);

  // Create DOM elements for the new book with proper ARIA attributes
  const bookCard = document.createElement('div');
  bookCard.classList.add('book-card');
  bookCard.setAttribute('role', 'article');
  bookCard.setAttribute('aria-label', `Book: ${title} by ${author}`);

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  titleElement.setAttribute('aria-label', `Title: ${title}`);

  const authorElement = document.createElement('p');
  authorElement.textContent = `Author: ${author}`;
  authorElement.setAttribute('aria-label', `Author: ${author}`);

  const pagesElement = document.createElement('p');
  pagesElement.textContent = `Pages: ${pages}`;
  pagesElement.setAttribute('aria-label', `Number of pages: ${pages}`);

  const readStatus = document.createElement('button');
  readStatus.classList.add('read-status');
  readStatus.textContent = read ? 'Read' : 'Not Read';
  readStatus.setAttribute('aria-pressed', read);
  readStatus.setAttribute('aria-label', `Read status: ${read ? 'Read' : 'Not Read'}`);

  readStatus.addEventListener('click', () => {
    newBook.toggleReadStatus();
    readStatus.textContent = newBook.read ? 'Read' : 'Not Read';
    readStatus.setAttribute('aria-pressed', newBook.read);
    readStatus.setAttribute('aria-label', `Read status: ${newBook.read ? 'Read' : 'Not Read'}`);
  });

  const removeButton = document.createElement('button');
  removeButton.classList.add('remove-book');
  removeButton.textContent = 'Remove';
  removeButton.setAttribute('aria-label', `Remove book: ${title}`);

  removeButton.addEventListener('click', () => {
    removeBookFromLibrary(newBook);
    bookCard.remove();
  });

  bookCard.appendChild(titleElement);
  bookCard.appendChild(authorElement);
  bookCard.appendChild(pagesElement);
  bookCard.appendChild(readStatus);
  bookCard.appendChild(removeButton);

  document.getElementById('book-grid').appendChild(bookCard);

  // Update the library display
  displayLibrary();
}

// ... (preserve all remaining existing code)