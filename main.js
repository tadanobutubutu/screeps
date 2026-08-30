// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Input, Form } from 'antd';
import { addBook } from './bookActions';

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
  return book.id;
}

// Function to render a single book item
export function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        description={book.author}
      />
    </List.Item>
  );
}

// Render the main component containing the book list and sorting controls
function Main() {
  const dispatch = useDispatch();
  const books = useSelector(state => state.books.list);
  const [sorting, setSorting] = useState(sortByTitle); // Default sort by title

  // Function to handle sorting the book list by title (ascending)
  const handleTitleSort = () => {
    const sortedList = [...books].sort(sortByTitle);
    dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
  };

  // Function to handle sorting the book list by author (descending)
  const handleAuthorSort = () => {
    const sortedList = [...books].sort(sortByAuthor);
    dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
  };

  // UseEffect hook to handle sorting book list updates when sorting preference or books list changes
  useEffect(() => {
    if (sorting === sortByTitle) {
      handleTitleSort();
    } else if (sorting === sortByAuthor) {
      handleAuthorSort();
    }
  }, [sorting, books]);

  // Function to handle adding a new book with accessibility improvements
  function handleAddBook(values) {
    dispatch(addBook({
      id: Date.now(), // Generate a unique id using current timestamp
      title: values.title,
      author: values.author,
    }));
  }

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map(book => BookItem(book));

  return (
    <div>
      <button onClick={handleTitleSort}>Sort by Title</button>
      <button onClick={handleAuthorSort}>Sort by Author</button>
      <List>
        {bookItems}
      </List>
      {/* Form for adding a new book with accessibility improvements */}
      <Form
        layout="inline"
        onFinish={handleAddBook}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{
            required: true,
            message: 'Please enter the book title'
          }]}
        >
          <Input aria-label="Book title" />
        </Form.Item>
        <Form.Item
          label="Author"
          name="author"
          rules={[{
            required: true,
            message: 'Please enter the book author'
          }]}
        >
          <Input aria-label="Book author" />
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