// Import necessary dependencies
import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List, Input, Button, Form } from 'antd';

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
  return book.id || `${book.title}-${book.author}`;
}

// Function to render a single book item
function BookItem(book) {
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
function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Accessible AddBookForm component with proper form controls and ARIA attributes
function AddBookForm({ onAdd }) {
  const [form] = Form.useForm();
  const titleInputRef = useRef(null);

  const handleSubmit = (values) => {
    if (onAdd) {
      onAdd(values);
    }
    form.resetFields();
    // Focus back on the title input after submission for accessibility
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit}
      aria-label="Add new book form"
      layout="inline"
    >
      <Form.Item
        name="title"
        rules={[{ required: true, message: 'Please enter a book title' }]}
      >
        <Input
          ref={titleInputRef}
          placeholder="Book title"
          aria-label="Book title"
          aria-required="true"
          data-testid="book-title-input"
        />
      </Form.Item>
      <Form.Item
        name="author"
        rules={[{ required: true, message: 'Please enter an author name' }]}
      >
        <Input
          placeholder="Author name"
          aria-label="Author name"
          aria-required="true"
          data-testid="book-author-input"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          aria-label="Add book to list"
        >
          Add Book
        </Button>
      </Form.Item>
    </Form>
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
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map((book) => BookItem(book));

  // Handle adding a new book
  const handleAddBook = (book) => {
    addBook(book);
  };

  // Render the list of book items and sorting controls
  return (
    <div lang="en">
      <h1 id="page-title">Book Library</h1>
      
      <section aria-labelledby="sorting-controls-heading">
        <h2 id="sorting-controls-heading" className="sr-only">Sorting Controls</h2>
        <button 
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title in ascending order"
          aria-pressed={sorting === sortByTitle}
        >
          Sort by Title
        </button>
        <button 
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author in descending order"
          aria-pressed={sorting === sortByAuthor}
        >
          Sort by Author
        </button>
      </section>

      <section aria-labelledby="add-book-heading">
        <h2 id="add-book-heading">Add a New Book</h2>
        <AddBookForm onAdd={handleAddBook} />
      </section>

      <section aria-labelledby="book-list-heading">
        <h2 id="book-list-heading">Book List</h2>
        <List
          aria-label="Books collection"
          bordered
          dataSource={getBooksList}
          renderItem={(book) => BookItem(book)}
        />
      </section>
    </div>
  );
}

// Export the Main component
export default Main;