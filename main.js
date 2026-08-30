// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { List, Button, Form, Input, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { setDependencyGraph } from './actions/dependencyGraph';
import { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, enhanceAccessibilityForAddBook } from './bookFunctions';

// Accessibility helper functions
const getRootHtmlAccessibilityProps = (lang = 'en') => {
  return { lang };
};

const getLandmarkProps = (role, label, id) => {
  const props = {
    role,
    'aria-label': label,
  };
  if (id) {
    props.id = id;
  }
  return props;
};

const getSvgAccessibilityProps = (label, labelledById) => {
  const props = {
    role: 'img',
    focusable: 'false',
  };
  if (label) {
    props['aria-label'] = label;
  } else if (labelledById) {
    props['aria-labelledby'] = labelledById;
  } else {
    // Fallback so the SVG is still considered decorative but explicitly marked.
    props['aria-hidden'] = 'true';
  }
  return props;
};

const getAccessibleLinkProps = (href, label) => {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
}

// Function to fetch book dependencies and update the Redux store
async function fetchBookDependencies(bookId) {
  // Fetch dependencies for the specified book
  // ... (Assuming you have an API endpoint to fetch book dependencies or implementing this logic)

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: /* The fetched dependencies */ }));
}

// Function to handle updating book dependencies
function updateBookDependencies(bookId, newDependencies) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
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

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort(booksList, dispatch) {
  const sortedList = [...booksList].sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BOOKS', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort(booksList, dispatch) {
  const sortedList = [...booksList].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BOOKS', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const [addBookFormVisible, setAddBookFormVisible] = useState(false);
  const [addBookForm] = Form.useForm();
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(booksList, dispatch);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(booksList, dispatch);
    }
  }, [sorting, booksList, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map(book => BookItem(book));

  const handleAddBook = () => {
    // Implement the accessibility improvements
    enhanceAccessibilityForAddBook();
    // Add the new book as before
    addBook();
  };

  const handleSort = (sortFunction) => () => {
    setSorting(sortFunction);
  };

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
    <main {...getLandmarkProps('main', 'Main content')}>
      <button onClick={showAddBookForm}>Add Book</button>
      <button onClick={handleSort(sortByTitle)}>Sort by Title</button>
      <button onClick={handleSort(sortByAuthor)}>Sort by Author</button>
      <List
        itemLayout="vertical"
        dataSource={booksList}
        renderItem={book => (
          <List.Item key={generateKey(book)}>
            <BookItem book={book} />
          </List.Item>
        )}
      />
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
      {booksList.length > 0 && (
        <Button onClick={handleAddBook}>
          {typeof enhanceAccessibilityForAddBook === 'function' ? 'Add Book (Experimental Accessibility Improvements)' : 'Add Book'}
        </Button>
      )}
      <button onClick={enhanceAccessibilityForAddBook} aria-label="Enhance accessibility for adding a new book">Enhance Accessibility</button>
    </main>
  );
}

export default Main;