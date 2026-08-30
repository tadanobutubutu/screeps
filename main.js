// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Function to handle sorting books by title (ascending)
function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return `${book.id}-${book.title}-${book.author}`;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store (ADD ACCESSIBILITY)
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });

  // Set the focus on the newly added book item
  document.querySelector(`[data-key="${generateKey(book)}"]`).focus();
}

// Function to get the accessible name for an SVG (ADD ACCESSIBILITY)
function getSvgAccessibleName(svgElement) {
  const titleElement = svgElement.getElementsByTagName('title')[0];
  return titleElement ? titleElement.textContent : svgElement.outerHTML;
}

// Function to set the accessible name for an SVG link (ADD ACCESSIBILITY)
function setSvgAttributes(svgLinkElement, accessibleName) {
  svgLinkElement.setAttribute('aria-labelledby', 'svg-accessible-name');
  const svgAccessibleNameElement = document.createElement('span');
  svgAccessibleNameElement.id = 'svg-accessible-name';
  svgAccessibleNameElement.innerHTML = accessibleName;
  svgLinkElement.appendChild(svgAccessibleNameElement);
}

// TODO: Implement the required changes to ensure unique landmarks (REFER: ensureUniqueLandmarks)
// ...

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = [...getBooksList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = [...getBooksList].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(BookItem);

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={bookItems} />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      <form onSubmit={e => {
        e.preventDefault();
        const title = e.target.elements.title.value;
        const author = e.target.elements.author.value;
        addBook({ id: Date.now(), title, author });
        e.target.reset();
      }}>
        <input type="text" placeholder="Title" name="title" required /><br />
        <input type="text" placeholder="Author" name="author" required /><br />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

// Extract the SVG links and apply accessible names (ADD ACCESSIBILITY)
function handleFakeLinks() {
  const svgLinks = document.querySelectorAll('svg a');
  svgLinks.forEach(setSvgAttributes);
}

// Export the Main component and handleFakeLinks function
export { Main, handleFakeLinks };