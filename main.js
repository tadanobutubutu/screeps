import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';
import { config } from './config';

// Function to handle sorting books by title (ascending)
export function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

// Function to handle sorting books by author (descending)
export function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
export function generateKey(book) {
  return book.id ? `${book.id}-${book.title}` : book.title;
}

// Function to render a single book item
export function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={`by ${book.author}`}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
export function addBook(dispatch, book) {
  const newBook = {
    id: Date.now(), // Generate a unique id using current timestamp
    title: book.title,
    author: book.author,
  };

  dispatch({ type: 'ADD_BOOK', payload: newBook });
}

// Function to handle adding a new book with accessibility improvements
function handleAddBook(values, dispatch, form, setAnnouncement) {
  addBook(dispatch, values);
  // Clear the form after successful submission
  form.resetFields();
  // Announce success for screen readers
  setAnnouncement(`Book "${values.title}" by ${values.author} has been added successfully.`);
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
export function onTitleSort(list) {
  const sortedList = [...list].sort(defaultSorting);
  return sortedList;
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort(list) {
  const sortedList = [...list].sort((a, b) => defaultSorting(b, a));
  return sortedList;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);

  useEffect(() => {
    const sortedList = onSortingFunction(booksList, sorting);
    setBooksList(sortedList);
  }, [sorting, booksList]);

  const onSortingFunction = (list, sortFn) => {
    if (sortFn === sortByTitle) {
      return onTitleSort(list);
    } else if (sortFn === sortByAuthor) {
      return onAuthorSort(list);
    }
    return list;
  };

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map((book, index) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      <button
        onClick={() => setSorting(sortByTitle)}
        aria-pressed={sorting === sortByTitle}
      >
        Sort by Title
      </button>
      <button
        onClick={() => setSorting(sortByAuthor)}
        aria-pressed={sorting === sortByAuthor}
      >
        Sort by Author
      </button>
      <List ref={listRef} aria-label="Book list">
        {bookItems}
      </List>
      <Form
        form={form}
        layout="inline"
        onFinish={(values) => handleAddBook(values, dispatch)}
        aria-label="Add new book form"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the book title' }]}
          aria-label="Book title"
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: 'Please enter the book author' }]}
          aria-label="Book author"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" aria-label="Add book">
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Server setup
const express = require('express');
const path = require('path');

// Configuration
const appState = {
  initialized: false,
  data: null,
  cache: new Map(),
  config
};

// Initialize function
function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

// Initialize app function
function initializeApp() {
  initialize();
  return appState;
}

function main() {
  initializeApp();
  console.log('Main function executed');
  return { executed: true };
}

if (require.main === module) {
  main();
}

module.exports = {
  appState,
  initializeApp,
  main
};