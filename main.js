import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { List } from 'antd';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

// Get the dispatch function
const dispatch = useDispatch();

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
  return `book-${book.id || book.title.toLowerCase().replace(/\s+/g, '-')}`;
}

// Function to render a single book item
function BookItem({ book }) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
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

// Function to handle adding a new book from the form
function handleAddBook(bookData) {
  if (bookData && bookData.title && bookData.author) {
    addBook(bookData);
  }
}

// AddBookForm component with accessibility improvements
function AddBookForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      onSubmit({ title: title.trim(), author: author.trim() });
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Add a new book"
      role="form"
    >
      <div>
        <label htmlFor="book-title-input">Book Title</label>
        <input
          id="book-title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Book title"
          required
        />
      </div>
      <div>
        <label htmlFor="book-author-input">Book Author</label>
        <input
          id="book-author-input"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-label="Book author"
          required
        />
      </div>
      <button
        type="submit"
        aria-label="Add new book"
        id="add-book-btn"
      >
        Add Book
      </button>
    </form>
  );
}

// Function for generating a report based on accessibility issues
function generateAccessibilityReport(issues) {
  if (!issues || issues.length === 0) {
    return 'No accessibility issues found.';
  }

  const totalIssues = issues.length;
  const criticalIssues = issues.filter(issue => issue.severity === 'critical').length;
  const majorIssues = issues.filter(issue => issue.severity === 'major').length;
  const minorIssues = issues.filter(issue => issue.severity === 'minor').length;

  let report = `Accessibility Report\n`;
  report += `===================\n`;
  report += `Total Issues: ${totalIssues}\n`;
  report += `Critical: ${criticalIssues}\n`;
  report += `Major: ${majorIssues}\n`;
  report += `Minor: ${minorIssues}\n\n`;

  report += `Issue Details:\n`;
  issues.forEach((issue, index) => {
    report += `${index + 1}. [${issue.severity.toUpperCase()}] ${issue.description}`;
    if (issue.element) {
      report += ` - Element: ${issue.element}`;
    }
    if (issue.suggestion) {
      report += ` - Suggestion: ${issue.suggestion}`;
    }
    report += `\n`;
  });

  return report;
}

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.slice().sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.slice().sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Export the necessary functions for use in other modules
export { sortByTitle, sortByAuthor, generateKey, BookItem, addBook, AddBookForm, onTitleSort, onAuthorSort, getLangAttribute, validateLandmark, validateLandmarkStructure, checkDocumentAccessibility, createInPageButton, validateLinkAccessibility, handleFakeLinks, validateTableAccessibility, validateTableStructure, getSvgAccessibleName, setSvgAttributes, handleAddBook, addLandmarks, getUniqueLandmarkName, isValidLink, addScopeToHeaders, addressAccessibilityIssues, getCellsAbove, getCellsInRow, setSvgAccessibleName };

// Accessibility Helper Functions (REACT_015, REACT_027, REACT_017, REACT_041, REACT_025, REACT_036)

// Default sorting function for the book list
const defaultSorting = sortByTitle;

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

    // Apply accessibility improvements on component mount
    const container = document.getElementById('main-content');
    if (container) {
      // Apply accessibility fixes
      fixLandmarkIssues(container);
      fixFakeLinkIssues(container);
      fixButtonIdentifiers(container);

      // Apply SVG accessibility
      addAccessibleNamesToSVGs(container, 'Graphical element');

      // Ensure dependency graph has proper ARIA role
      ensureDependencyGraphAriaRole(container);
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <div id="main-content" role="main" aria-label="Main content">
      <nav aria-label="Sorting controls">
        <button
          onClick={() => setSorting(sortByTitle)}
          aria-label="Sort books by title"
          id="sort-by-title-btn"
        >
          Sort by Title
        </button>
        <button
          onClick={() => setSorting(sortByAuthor)}
          aria-label="Sort books by author"
          id="sort-by-author-btn"
        >
          Sort by Author
        </button>
      </nav>
      <List
        dataSource={getBooksList}
        renderItem={book => BookItem(book)}
        aria-label="Book list"
      />
      {/* Implement the required changes to improve accessibility for adding a new book */}
      <AddBookForm onSubmit={handleAddBook} />
    </div>
  );
}

// Export the Main component
export default Main;