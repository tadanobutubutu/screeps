import React, { useState, useEffect, useCallback } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';
import { useId } from '@react-aria/utils';
import { ADD_BOOK, SORT_BY_TITLE, SORT_BY_AUTHOR } from './store/types';

const getBooksList = useSelector(state => state.books.list);

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

function generateKey(book) {
  return book.id || `${book.title}-${book.author}`;
}

function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)} role="listitem">
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

const defaultSorting = 'title';

function onTitleSort(dispatch, books) {
  const sortedList = [...books].sort(sortByTitle);
  dispatch({ type: SORT_BY_TITLE, payload: sortedList });
}

function onAuthorSort(dispatch, books) {
  const sortedList = [...books].sort(sortByAuthor);
  dispatch({ type: SORT_BY_AUTHOR, payload: sortedList });
}

function addBook(book) {
  return { type: ADD_BOOK, payload: book };
}

function AddBookForm({ onAdd }) {
  const formId = useId();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

Also the DependencyGraph props: both use nodes={[]} edges={[]}. That's fine.

Now the export list: Both sides have same exports; but there may be duplication. We need to combine and ensure no duplicate definitions. The conflict appears in the function definitions (onTitleSort, onAuthorSort) and maybe in the component return (bookItems mapping, nav structure). Also imports.

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Add new book form"
      id={formId}
    >
      <div>
        <label
          htmlFor={titleId}
          id={`${titleId}-label`}
        >
          Book Title:
        </label>
        <input
          type="text"
          id={titleId}
          aria-labelledby={`${titleId}-label`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter book title"
          aria-required="true"
        />
      </div>
      <div>
        <label
          htmlFor={authorId}
          id={`${authorId}-label`}
        >
          Author:
        </label>
        <input
          type="text"
          id={authorId}
          aria-labelledby={`${authorId}-label`}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          placeholder="Enter author name"
          aria-required="true"
        />
      </div>
      <button
        type="submit"
        aria-label="Add book to collection"
      >
        Add Book
      </button>
    </form>
  );
}

export {
  sortByTitle,
  sortByAuthor,
  generateKey,
  BookItem,
  addBook,
  onTitleSort,
  onAuthorSort,
  defaultSorting,
  AddBookForm
};