// TODO: This is the existing code that needs to be preserved
// _Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
// <!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
// _Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
// <!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
// _Commit: 30b5f0892a59d5ec914a59aa66e32dc3a3eb059e_
// <!-- todo-hash: 1f81632535b0749b809ac49f5e1c81cf4389f9c1 -->
// _Commit: 27dae42cfb76460febd5f12d5b213653e5454983_
// <!-- todo-hash: e944d6bc26c576658cd5c819c30f566e3ef878d -->

import React, { useState, useEffect } from 'react';
import { List, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';
import { useLandmark, getFullLangAttribute, addLangAttribute } from './utils';
import { getRootHtmlAccessibilityProps, getLandmarkProps, getSvgAccessibilityProps, getAccessibleLinkProps } from './accessibility';

const Main = () => {
  const [sorting, setSorting] = useState(sortByTitle);
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const addBookInputRef = React.useRef(null);

  // Sorting functions from both branches (they complement each other)
  function sortByTitle(a, b) {
    return a.title.localeCompare(b.title);
  }

  function sortByAuthor(a, b) {
    return b.author.localeCompare(a.author);
  }

  function generateKey(book) {
    return book.id ? `book-${book.id}` : `book-${book.title}-${book.author}`;
  }

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

  // AddBook component modified to accept title and author as props
  function AddBook({ onAdd, title, author }) {
    const [titleForm, setTitleForm] = useState(title);
    const [authorForm, setAuthorForm] = useState(author);

    const handleSubmit = (event) => {
      event.preventDefault();
      setTitleForm('');
      setAuthorForm('');

      if (titleForm.trim() && authorForm.trim()) {
        addBook({ title: titleForm.trim(), author: authorForm.trim() });
      } else {
        // Fallback to simple addBook call if needed
        addBook();
      }
    };

    return (
      <form onSubmit={handleSubmit} aria-label="Add new book">
        <div>
          <label htmlFor="book-title-input">Book Title:</label>
          <input
            id="book-title-input"
            type="text"
            value={titleForm}
            onChange={(e) => setTitleForm(e.target.value)}
            ref={addBookInputRef}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'book-title-error' : undefined}
            placeholder="Enter book title"
          />
        </div>
        <div>
          <label htmlFor="book-author-input">Book Author:</label>
          <input
            id="book-author-input"
            type="text"
            value={authorForm}
            onChange={(e) => setAuthorForm(e.target.value)}
            required
            aria-required="true"
            aria-invalid={!!error}
            aria-describedby={error ? 'book-author-error' : undefined}
            placeholder="Enter author name"
          />
        </div>
        {error && (
          <div role="alert" aria-live="polite" id="book-title-error">
            {error}
          </div>
        )}
        <button type="submit" aria-label="Submit new book">Add Book</button>
      </form>
    );
  }

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
  const listItems = booksList.map(book => BookItem(book));

  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={listItems} renderItem={(book) => BookItem(book)} />
      <AddBook onAdd={addBook} title={newBookTitle} author={newBookAuthor} />
    </div>
  );
};

export default Main;