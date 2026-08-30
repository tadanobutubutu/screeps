// Import necessary dependencies
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

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
  return book.id || `${book.title}-${book.author}`;
}

// Function to render a single book item
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(dispatch, books) {
  const sortedList = [...books].sort(sortByTitle);
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(dispatch, books) {
  const sortedList = [...books].sort(sortByAuthor);
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(defaultSorting);

  // Create memoized sort handlers
  const handleTitleSort = useCallback(() => {
    onTitleSort(dispatch, books);
  }, [dispatch, books]);

  const handleAuthorSort = useCallback(() => {
    onAuthorSort(dispatch, books);
  }, [dispatch, books]);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      handleTitleSort();
    } else if (sorting === sortByAuthor) {
      handleAuthorSort();
    }
  }, [sorting, handleTitleSort, handleAuthorSort]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List
        dataSource={books}
        renderItem={(book) => (
          <List.Item key={generateKey(book)}>
            <List.Item.Meta
              title={book.title}
              description={book.author}
            />
          </List.Item>
        )}
      />
    </div>
  );
}

// Export the Main component
export default Main;