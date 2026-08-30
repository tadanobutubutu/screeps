// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Button, Form, Input, message } from 'antd';

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

// Function to create a new book entry in the Redux store
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Function to handle form submission for adding a new book
function handleAddBookFormSubmit(values) {
  // Validate the form data and add the book if valid
  // ...

  // Dispatch an action to add the book
  addBook(values);
  // Show a success message
  message.success('Book added successfully!');
}

// Function to generate a unique key for the new book
function generateNewBookKey() {
  // Implementation for generating a unique key for a new book
  // ...
  return Date.now(); // Example implementation
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
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [addBookFormVisible, setAddBookFormVisible] = useState(false);
  const [addBookForm] = Form.useForm();

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

  // Function to handle opening the add book form
  const showAddBookForm = () => {
    setAddBookFormVisible(true);
  };

  // Function to handle closing the add book form
  const handleAddBookFormCancel = () => {
    setAddBookFormVisible(false);
    addBookForm.resetFields();
  };

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={showAddBookForm}>Add Book</button>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List dataSource={bookItems} />
      {addBookFormVisible && (
        <Form
          form={addBookForm}
          onFinish={handleAddBookFormSubmit}
          onReset={handleAddBookFormCancel}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the book title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="author"
            label="Author"
            rules={[{ required: true, message: 'Please input the book author!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Book
            </Button>
            <Button onClick={handleAddBookFormCancel} style={{ marginLeft: 8 }}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

// Export the Main component
export default Main;