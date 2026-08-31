// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';

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
        description={book.author}
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
export function addBook(dispatch, book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Function to handle adding a new book with accessibility improvements
function handleAddBook(values, dispatch, form, setAnnouncement) {
  const newBook = {
    id: Date.now(), // Generate a unique id using current timestamp
    title: values.title,
    author: values.author,
  };
  
  addBook(dispatch, newBook);
  
  // Clear the form after successful submission
  form.resetFields();
  
  // Announce success for screen readers
  if (setAnnouncement) {
    setAnnouncement(`Book "${newBook.title}" by ${newBook.author} has been added successfully.`);
  }
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
export function onTitleSort(dispatch, sortedList) {
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
export function onAuthorSort(dispatch, sortedList) {
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [form] = Form.useForm();
  const [announcement, setAnnouncement] = useState('');
  const dispatch = useDispatch();
  const listRef = useRef(null);
  
  // Get the list of books from the Redux store
  const booksList = useSelector(state => state.books.list);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    const sortedList = [...booksList].sort(sorting);
    if (sorting === sortByTitle) {
      onTitleSort(dispatch, sortedList);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(dispatch, sortedList);
    }
  }, [sorting, dispatch, booksList]);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map((book, index) => (
    <BookItem key={generateKey(book)} book={book} />
  ));

  // Render the list of book items and sorting controls
  return (
    <div>
      {/* Live region for screen reader announcements */}
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
      {/* ... */}
      <Form
        form={form}
        layout="inline"
        onFinish={(values) => handleAddBook(values, dispatch, form, setAnnouncement)}
        aria-label="Add new book form"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please enter the book title' }]}
        >
          <Input aria-label="Book title" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{ required: true, message: 'Please enter the book author' }]}
        >
          <Input aria-label="Book author" />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            aria-label="Add book"
          >
            Add Book
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

// Export the required functionA and functionB as objects with properties X, Y, and Z
export const functionA = {
  X: null,
  Y: null,
  Z: null
};

export const functionB = {
  X: null,
  Y: null,
  Z: null
};

// Export the Main component
export default Main;