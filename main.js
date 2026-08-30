import React, { useState, useEffect, useRef } from 'react';
import { List } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { addBook } from './bookActions';

function generateKey(book) {
  return `${book.id}-${book.title}`;
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

function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || !author.trim()) return;

    const newBook = { id: Date.now(), title, author };
    dispatch(addBook(newBook));
    setTitle('');
    setAuthor('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title:</label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      />
      <label htmlFor="author">Author:</label>
      <input
        id="author"
        type="text"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        required
      />
      <button type="submit">Add Book</button>
    </form>
  );
}

export { AddBookForm, defaultSorting, sortByTitle, sortByAuthor, onTitleSort, onAuthorSort, generateKey, BookItem, sortByTitle as ascendingTitleSort, sortByAuthor as descendingAuthorSort, AddBookForm as AddBook };
export default AddBookForm;

function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const sortIconUpRef = useRef(null);
  const sortIconDownRef = useRef(null);

  // ... (useEffect and mapping of book list)

  // Render the list of book items and sorting controls
  return (
    <main id="main-content" role="main" aria-label="Book list and sorting controls">
      <nav role="navigation" aria-label="Sorting controls">
        <button
          id="sort-by-title-button"
          onClick={() => setSorting(defaultSorting === sortByTitle ? sortByAuthor : sortByTitle)}
          aria-pressed={sorting === sortByTitle}
          aria-label={sorting === sortByTitle ? "Sort books by title ascending" : "Sort books by title descending"}
          ref={sortIconUpRef}
          aria-describedby="sort-by-title-description"
        >
          Sort by Title
          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 5C10 5.16927 9.93833 5.31576 9.81445 5.43945C9.69057 5.56315 9.54427 5.625 9.375 5.625H0.625C0.455729 5.625 0.309425 5.56315 0.185547 5.43945C0.0606743 5.31576 0 5.16927 0 5C0 4.83073 0.0606743 4.68424 0.185547 4.56055L4.56055 0.185547C4.68424 0.0606743 4.83073 0 5 0H9.375C9.54427 0 9.69057 0.0606743 9.81445 0.185547C9.93833 0.309425 10 0.455729 10 0.625V5Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button
          id="sort-by-author-button"
          onClick={() => setSorting(defaultSorting === sortByAuthor ? sortByTitle : sortByAuthor)}
          aria-pressed={sorting === sortByAuthor}
          aria-label={sorting === sortByAuthor ? "Sort books by author descending" : "Sort books by author ascending"}
          ref={sortIconDownRef}
          aria-describedby="sort-by-author-description"
        >
          Sort by Author
          <svg viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M-0.0006 5.625C-0.0006 5.70376 0.0688662 5.78125 0.25 5.78125H9.06562C9.13114 5.78125 9.19936 5.70376 9.19936 5.625C9.19936 5.54624 9.13114 5.46875 9.06562 5.46875H0.25C0.0688663 5.46875 -0.0006 5.54625 -0.0006 5.625ZM0 0H9.64062C9.70937 0 9.76762 0.030593 9.80606 0.09375C9.84449 0.156887 9.84449 0.333333 9.80606 0.49375L0.4937501 4.66406C0.447969 4.70583 0.384375 4.75 0.3125 4.75H0.15625C0.0688663 4.75 -0.0006 4.70584 -0.0006 4.66406L0.0006 0.49375C0.15625 0.156889 0.384375 0.0688662 0.447968 0.09375C0.49375 0.0305941 0.49375 0 -0.0006 0Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </nav>
      <List
        id="book-list"
        aria-label="List of books"
        itemLayout="horizontal"
        dataSource={getBooksList()}
        renderItem={(item) => BookItem(item)}
      />
      <AddBookForm />
    </main>
  );
}

export default Main;