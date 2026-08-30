// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
// Version 1 implementation (HEAD branch)
// Code for version 1 implementation goes here.

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
  return `${book.id}-${book.title}`;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={`by ${book.author}`}
        avatar={book.coverImage && <img src={book.coverImage} alt={`Cover of ${book.title}`} style={{ width: 50, height: 75 }} />}
      />
    </List.Item>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);

  // Function to handle sorting books by title (ascending)
  function sortBooksByTitle(books) {
    return [...books].sort((a, b) => a.title.localeCompare(b.title));
  }

  // Function to handle sorting books by author (descending)
  function sortBooksByAuthor(books) {
    return [...books].sort((a, b) => b.author.localeCompare(a.author));
  }

  // Function to handle sorting the book list by title (ascending)
  function onTitleSort() {
    const sortedList = sortBooksByTitle(booksList);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
  }

  // Function to handle sorting the book list by author (descending)
  function onAuthorSort() {
    const sortedList = sortBooksByAuthor(booksList);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
  }

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map((book) => (
    <BookItem key={book.id} book={book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List
        dataSource={booksList}
        renderItem={(book) => (
          <List.Item key={book.id}>
            <List.Item.Meta
              title={book.title}
              description={`by ${book.author}`}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

// Export the Main component
export default Main;