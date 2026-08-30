// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Form, Input, Button, UUID } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useId } from '@react-aria/utils';

// ... (Existing code)

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Function to create a form for adding a new book
function AddBookForm() {
  const formId = useId();
  const [book, setBook] = useState({ title: '', author: '', id: UUID.generate() });

  function handleChange(event) {
    setBook({ ...book, [event.target.name]: event.target.value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    addBook(book);
    // Clear the form
    setBook({ title: '', author: '', id: UUID.generate() });
  }

  return (
    <Form id={formId} onSubmit={handleSubmit}>
      <Form.Item
        label="Title"
        htmlFor={`${formId}-title`}
        help="Enter the title of the book"
      >
        <Input id={`${formId}-title`} type="text" name="title" value={book.title} onChange={handleChange} />
      </Form.Item>
      <Form.Item
        label="Author"
        htmlFor={`${formId}-author`}
        help="Enter the author of the book"
      >
        <Input id={`${formId}-author`} type="text" name="author" value={book.author} onChange={handleChange} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Book
        </Button>
      </Form.Item>
    </Form>
  );
}

// ... (Existing code reconstructed)

// Render the main component containing the book list, sorting controls, and add book form
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);

  // ... (Existing useEffect hook)

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(BookItem);

  // Render the list of book items, sorting controls, and the add book form
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={bookItems} />
      <AddBookForm />
    </div>
  );
}

// Export the Main component
export default Main;