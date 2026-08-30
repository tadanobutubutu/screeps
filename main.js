const defaultSorting = sortByTitle;

function onAuthorSort(books, dispatch) {
  const sortedList = [...books].sort(sortByAuthor);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Render the main component containing the book list and sorting controls
function Main() {
  // Get the list of books from the Redux store
  const books = useSelector(state => state.books.list);
  const dispatch = useDispatch();
  const [sorting, setSorting] = useState(defaultSorting);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const addBookInputRef = React.useRef(null);

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort(books, dispatch);
    } else if (sorting === sortByAuthor) {
      onAuthorSort(books, dispatch);
    }
  }, [sorting, books, dispatch]);

  // Map the book list to the BookItem function to create book items
  const bookItems = books.map((book) => BookItem(book));

  // Handle form submission for adding a new book
  const handleAddBook = (event) => {
    event.preventDefault();
    const newBook = {
      id: Date.now(),
      title: newBookTitle,
      author: newBookAuthor,
    };
    addBook(dispatch, newBook);
    setNewBookTitle('');
    setNewBookAuthor('');
    // Set focus back to the title input for accessibility
    if (addBookInputRef.current) {
      addBookInputRef.current.focus();
    }
  };

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List>
        {bookItems}
      </List>
      {/* Accessible form for adding a new book */}
      <form onSubmit={handleAddBook} aria-label="Add new book">
        <div>
          <label htmlFor="book-title">Book Title:</label>
          <input
            id="book-title"
            type="text"
            value={newBookTitle}
            onChange={(e) => setNewBookTitle(e.target.value)}
            ref={addBookInputRef}
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="book-author">Author:</label>
          <input
            id="book-author"
            type="text"
            value={newBookAuthor}
            onChange={(e) => setNewBookAuthor(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

// Export the Main component
export default Main;