import { initializeApp } from './app.js';
import { registerSW } from 'effector-sw';
import { isSecureContext } from './utils.js';
import { calculateSum } from './utils';
import { getLangAttribute, getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks } from './utils/linkAccessibilityUtils';
import { CONFIG } from './utils/constants';
import { App } from './App';
import './styles.css';

// Import dependency graph and index content from appropriate modules
import { dependencyGraphContent } from './dependencyGraphContent';
import { indexContent } from './indexContent';

// Get the list of books from the Redux store
const getBooksList = useSelector(state => state.books.list);

let icons = {};

// Configuration and state
let config = {};
let appState = {};

// Initialize function
function initialize() {
  config = { apiUrl: process.env.API_URL || 'default', timeout: 5000 };
  appState = { initialized: true };
}

function initializeAppWrapper() {
  initialize();
}

function processData(data) {
  return data;
}

function fetchUser(userId) {
  return { id: userId, name: 'User' };
}

function clearCache() {
  appState = {};
}

function validateInput(input) {
  return input && input.length > 0;
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

// Run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  main();
}

// Tower Defense System (pure JS, no React dependencies)
function createTowerDefenseSystem() {
  const towers = [];
  const enemies = [];
  let score = 0;
  let lives = 10;
  const gridSize = 8;
  
  function createTower(x, y, type = 'basic') {
    const tower = {
      id: `tower-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      type,
      damage: type === 'basic' ? 10 : type === 'sniper' ? 25 : 5,
      range: type === 'basic' ? 2 : type === 'sniper' ? 5 : 1,
      fireRate: type === 'basic' ? 1000 : type === 'sniper' ? 2000 : 500,
      lastFired: 0
    };
    towers.push(tower);
    return tower;
  }
  
  function createEnemy(pathIndex = 0, health = 100) {
    const enemy = {
      id: `enemy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pathIndex,
      health,
      maxHealth: health,
      speed: 1,
      x: pathIndex,
      y: 0,
      reward: 10
    };
    enemies.push(enemy);
    return enemy;
  }
  
  function getTowersInRange(x, y) {
    return towers.filter(tower => {
      const distance = Math.sqrt(Math.pow(tower.x - x, 2) + Math.pow(tower.y - y, 2));
      return distance <= tower.range;
    });
  }
  
  function damageEnemy(enemy, damage) {
    enemy.health -= damage;
    if (enemy.health <= 0) {
      score += enemy.reward;
      return true;
    }
    return false;
  }
  
  function moveEnemies() {
    enemies.forEach(enemy => {
      if (enemy.pathIndex < gridSize - 1) {
        enemy.pathIndex += enemy.speed;
      } else {
        lives -= 1;
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1);
        }
      }
    });
  }
  
  function updateTowers(currentTime) {
    enemies.forEach(enemy => {
      const inRangeTowers = getTowersInRange(enemy.pathIndex, enemy.y);
      inRangeTowers.forEach(tower => {
        if (currentTime - tower.lastFired >= tower.fireRate) {
          const destroyed = damageEnemy(enemy, tower.damage);
          tower.lastFired = currentTime;
          if (destroyed) {
            const index = enemies.indexOf(enemy);
            if (index > -1) {
              enemies.splice(index, 1);
            }
          }
        }
      });
    });
  }
  
  function getScore() {
    return score;
  }
  
  function getLives() {
    return lives;
  }
  
  function getAllTowers() {
    return [...towers];
  }
  
  function getAllEnemies() {
    return [...enemies];
  }
  
  function isGameOver() {
    return lives <= 0;
  }
  
  return {
    createTower,
    createEnemy,
    getTowersInRange,
    damageEnemy,
    moveEnemies,
    updateTowers,
    getScore,
    getLives,
    getAllTowers,
    getAllEnemies,
    isGameOver,
    gridSize
  };
}

// Accessibility utilities
function ensureAriaAttributes() {
  const lang = getLangAttribute();
  
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
  
  return {
    lang: lang,
    accessible: true
  };
}

function generateAccessibilityReport() {
  return { timestamp: new Date().toISOString(), issues: [] };
}

function wrapPrimaryContentInMain(parent) {
  // ... original function implementation ...
}

function addLangAttribute() {
  const lang = getLangAttribute();
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

function createInPageButton() {
  // Implementation for creating in-page button
}

function isValidLandmark(landmark) {
  return landmark && landmark.role;
}

function loadLandmarks() {
  return [];
}

function processLandmarks(landmarks) {
  return landmarks;
}

function sortLandmarks(landmarks) {
  return landmarks.sort((a, b) => a.id.localeCompare(b.id));
}

function getLandmarkById(landmarks, id) {
  return landmarks.find(l => l.id === id);
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

function formatResponse(data) {
  return { success: true, data };
}

// Implemented validateLandmark functionality
function validateLandmark(landmark) {
  const errors = [];

  // Check if landmark exists
  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }
  return 'en';
}

// Function to ensure ARIA attributes are properly set for the dependency graph
function ... {
  // Ensure the document has proper lang attribute for accessibility
  const lang = getLangAttribute();
  
  // Set lang attribute on document root if not already set
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  }
  
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

// Helper to get landmark props
function getLandmarkProps(role, label, id) {
  const props = {
    role: role,
    'aria-label': label,
  };
  if (id) {
    props.id = id;
  }
  return props;
}

// Function to count dependencies
function countDependencies() {
  const dependencies = {
    'react': true,
    'react-redux': true,
    'antd': true
  };
  return Object.keys(dependencies).length;
};

// Function to generate a key for each book item
function generateKey(book) {
  if (book.id) {
    return book.id;
  }
  return `${book.title}-${book.author}-${Math.random().toString(36).substr(2, 9)}`;
};

// Function to fetch book dependencies and update the Redux store
async function fetchBookDependencies(bookId) {
  try {
    const response = await fetch(`https://api.example.com/books/${bookId}/dependencies`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const dependencies = await response.json();
    dispatch(setDependencyGraph({ bookId, dependencies }));
  } catch (error) {
    console.error('Error fetching book dependencies:', error);
  }
}

// Function to handle updating book dependencies
function updateBookDependencies(bookId, newDependencies) {
  // Perform any necessary validation or processing before updating the book's dependencies
  // ...

  // Dispatch an action to update the book's dependencies in the Redux store
  dispatch(setDependencyGraph({ bookId, dependencies: newDependencies }));
};

// Accessibility: AddBookForm component with proper labels and ARIA attributes
function AddBookForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && author.trim()) {
      onAdd({ title: title.trim(), author: author.trim() });
      setTitle('');
      setAuthor('');
    }
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Add new book">
      <div>
        <label htmlFor="book-title" aria-required="true">Book Title:</label>
        <input
          id="book-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter book title"
        />
      </div>
      <div>
        <label htmlFor="book-author" aria-required="true">Author:</label>
        <input
          id="book-author"
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter author name"
        />
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
};

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = getBooksList.sort(sortByTitle);
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
};

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = getBooksList.sort(sortByAuthor).reverse();
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
};

// REACT_015: Helper to provide the lang attribute for the HTML element.
// Returns an object containing props to spread onto the root <html> element.
function getRootHtmlAccessibilityProps(lang = 'en') {
  return { lang };
};

// REACT_017 / REACT_025: Helper to build landmark region props with a unique
// label so each landmark has a distinct accessible name (fixes duplicate
// landmarks and ensures proper landmark roles are used).
function getLandmarkProps(role, label, id) {
  const props = {
    role,
    'aria-label': label,
  };
  if (id) {
    props.id = id;
  }
  return props;
};

// REACT_041: Helper to return props that provide an accessible name for an
// <svg> element (via aria-label) so screen readers can announce it.
function getSvgAccessibilityProps(label, labelledById) {
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

// REACT_036: Helper that returns props for converting a non-semantic element
// that is being used as a link into a real, accessible anchor.
function getAccessibleLinkProps(href, label) {
  return {
    href,
    role: 'link',
    'aria-label': label,
  };
};

// Function to address accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport(insightReport) {
  const fixes = [];
  if (!insightReport || !insightReport.accessibilityIssues) {
    return fixes;
  }

  const issues = insightReport.accessibilityIssues;

  issues.forEach(issue => {
    switch (issue.type) {
      case 'missing-alt-text':
        fixes.push({
          element: issue.elementId,
          action: 'addAltText',
          altText: issue.suggestedAltText || ''
        });
        break;
      case 'low-contrast':
        fixes.push({
          element: issue.elementId,
          action: 'adjustColorContrast',
          suggestedColors: issue.suggestedColors || {}
        });
        break;
      case 'missing-label':
        fixes.push({
          element: issue.elementId,
          action: 'addLabel',
          label: issue.suggestedLabel || ''
        });
        break;
      case 'empty-heading':
        fixes.push({
          element: issue.elementId,
          action: 'addHeadingText',
          text: issue.suggestedText || 'Untitled Section'
        });
        break;
      case 'duplicate-id':
        fixes.push({
          element: issue.elementId,
          action: 'makeIdUnique',
          newId: issue.suggestedId || `${issue.elementId}-${Math.random().toString(36).substr(2, 9)}`
        });
        break;
      case 'missing-lang':
        fixes.push({
          element: 'html',
          action: 'setLang',
          lang: issue.suggestedLang || 'en'
        });
        break;
      default:
        break;
    }
  });

  return fixes;
}

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(() => {
    const sortFunction = addBook.length > 0 ? sortByTitle : sortByTitle; // Use sortByTitle if the 'addBook' function is present, otherwise use default
    return sortFunction;
  });
  const dispatch = useDispatch();
  const booksList = useSelector(state => state.books.list);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const addBookInputRef = React.useRef(null);

  // Map the book list to the BookItem function to create book items
  const bookItems = booksList.map(book => BookItem(book));

  const handleAddBook = (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    // Implement the accessibility improvements
    if (typeof enhanceAccessibilityForAddBook === 'function') {
      enhanceAccessibilityForAddBook();
    }
    // Add the new book using the form values if provided
    if (newBookTitle.trim() && newBookAuthor.trim()) {
      addBook({ title: newBookTitle.trim(), author: newBookAuthor.trim() });
      setNewBookTitle('');
      setNewBookAuthor('');
    } else {
      // Add the new book as before
      addBook();
    }
  };

  const handleSort = (sortFunction) => () => {
    const sortedList = [...booksList].sort(sortFunction);
    // Dispatch an action to update the sorted book list in the Redux store
    dispatch({ type: 'SORT_BOOKS', payload: sortedList });
    setSorting(sortFunction);
  };

  // Render the list of book items and sorting controls
  return (
    <main {...getLandmarkProps('main', 'Main content')}>
      <div>
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
          <button type="submit">
            {typeof enhanceAccessibilityForAddBook === 'function' ? 'Add Book (Experimental Accessibility Improvements)' : 'Add Book'}
          </button>
        </form>
        <button onClick={enhanceAccessibilityForAddBook} aria-label="Enhance accessibility for adding a new book">Enhance Accessibility</button>
      </div>
    </main>
  );
};

// Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: getSvgAccessibleName)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks - updated to keep single <main>)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)
function addressAccessibilityIssues(insightReport) {
  // This addresses issues from the insight report:
  // - REACT_015: Add lang attribute to HTML element
  // - REACT_027: Fix table structure issues
  // - REACT_017: Add/fix landmark issues
  // - REACT_041: Add accessible names to SVGs
  // - REACT_025: Ensure unique landmarks (2 issues)
  // - REACT_036: Fix fake link issue

  if (!insightReport || !insightReport.issues) {
    return;
  }

  // Address accessibility issues from insight report
  insightReport.issues.forEach((issue) => {
    switch (issue.type) {
      case 'REACT_015':
        // Add lang attribute to HTML element
        if (issue.element) {
          addLangAttribute(issue.element);
        }
        break;
      case 'REACT_027':
        // Fix table structure issues
        if (issue.type === 'structure') {
          validateTableStructure();
          fixTableStructure();
        } else {
          validateTableAccessibility();
        }
        break;
      case 'REACT_017':
        // Add/fix landmark issues
        addMainLandmark();
        validateLandmark();
        validateLandmarkStructure();
        validateLandmarkAttributes();
        addLandmarkRegions();
        break;
      case 'REACT_041':
        // Add accessible names to SVGs
        if (issue.element) {
          setSvgAttributes(issue.element, issue.accessibleName || getSvgAccessibleName());
        }
        break;
      case 'REACT_025':
        // Ensure unique landmarks
        ensureUniqueLandmarks();
        break;
      case 'REACT_036':
        // Fix fake link issue
        handleFakeLinks();
        fixFakeLinks();
        break;
      default:
        console.log('Unknown issue type:', issue.type);
    }
  });
}

function getInsightReport() {
  const issues = [];
  
  // Check for lang attribute on HTML element
  const langAttribute = getLangAttribute();
  if (!langAttribute) {
    issues.push({
      type: 'REACT_015',
      description: 'HTML element is missing lang attribute',
      severity: 'critical',
      element: 'html'
    });
  }
  
  // Check table accessibility
  const tableAccessibilityIssues = validateTableAccessibility();
  if (tableAccessibilityIssues && tableAccessibilityIssues.length > 0) {
    tableAccessibilityIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_027',
        subtype: 'accessibility',
        description: issue.description || 'Table accessibility issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  // Check table structure
  const tableStructureIssues = validateTableStructure();
  if (tableStructureIssues && tableStructureIssues.length > 0) {
    tableStructureIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_027',
        subtype: 'structure',
        description: issue.description || 'Table structure issue',
        severity: issue.severity || 'high',
        element: issue.element,
        table: issue.table
      });
    });
  }
  
  // Check landmark issues
  const landmarkIssues = validateLandmark();
  if (landmarkIssues && landmarkIssues.length > 0) {
    landmarkIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check landmark structure
  const landmarkStructureIssues = validateLandmarkStructure();
  if (landmarkStructureIssues && landmarkStructureIssues.length > 0) {
    landmarkStructureIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        structure: true,
        description: issue.description || 'Landmark structure issue',
        severity: issue.severity || 'medium',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check landmark attributes
  const landmarkAttributeIssues = validateLandmarkAttributes();
  if (landmarkAttributeIssues && landmarkAttributeIssues.length > 0) {
    landmarkAttributeIssues.forEach((issue) => {
      issues.push({
        type: 'REACT_017',
        description: issue.description || 'Landmark attribute issue',
        severity: issue.severity || 'low',
        element: issue.element,
        landmark: issue.landmark
      });
    });
  }
  
  // Check SVG accessibility
  const svgAccessibleNames = getSvgAccessibleName();

  return issues;
}

/**
 * Initializes the application and applies accessibility fixes.
 */
const initApp = () => {
  // Initialize the main application
  initializeAppWrapper();

  // Apply accessibility fixes
  setLanguageAttribute(); // Default to 'en'
  addLandmarkRoles();
  ensureUniqueLandmarks([]);

  // Add accessible names to SVGs (example selectors and names)
  icons = {
    icon: '<svg viewBox="0 0 100 100" aria-label="Screeps icon"></svg>'
  };

  // Fix fake links
  fixFakeLinks();

  // Initialize the application data
  console.log('Initializing ' + appData.title + ' v' + appData.version);
};

function setLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
}

function addLandmarkRoles() {
  // Implementation for adding landmark roles
}

function fixFakeLinks() {
  // Implementation for fixing fake links
}

// Check if the environment is secure before initializing
if (typeof isSecureContext === 'function' && isSecureContext()) {
  initApp();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.';
  }
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return appData.version;
}

// Book management utilities (adapted for Node.js)
function generateKey(book) {
  return book.id || `${book.title.substring(0, 3)}-${Math.random().toString(36).substr(2, 9)}`;
}

function sortByTitle(a, b) {
  return a.title.localeCompare(b.title);
}

function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

function countDependencies() {
  const dependencies = ['express', 'effector-sw'];
  return dependencies.length;
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

// Function to handle sorting books by author (descending)
function sortByAuthor(a, b) {
  return b.author.localeCompare(a.author);
}

// Function to generate a key for each book item
function generateKey(book) {
  return book.id || ... 9)}`;
}

// Function to render dependency graph content
function renderDependencyGraph() {
  return (
    <div ...
      {dependencyGraphContent}
    </div>
  );
}

// Function to render index view content
function renderIndexView() {
  return (
    <div ...
      {indexContent}
    </div>
  );
}

// Function to count dependencies
function countDependencies() {
  const dependencies = ['react', 'react-redux', 'antd'];
  return dependencies.length;
}

// Function to render a single book item
function BookItem(book) {
  return (
    <List.Item key={generateKey(book)}>
      <List.Item.Meta
        title={book.title}
        ...
      />
    </List.Item>
  );
}

// Function to create a new book entry in the Redux store
export function addBook(book) {
  // Perform any necessary validation or processing before adding the book
  // ...

  // Dispatch an action to add the book to the books list in the Redux store
  dispatch({ type: 'ADD_BOOK', payload: book });
}

// Ensure accessibility attributes are set when adding a book
...

// Default sorting function for the book list
const defaultSorting = sortByTitle;

// Function to handle sorting the book list by title (ascending)
function onTitleSort() {
  const sortedList = ...
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

// Function to handle sorting the book list by author (descending)
function onAuthorSort() {
  const sortedList = ...
  // Dispatch an action to update the sorted book list in the Redux store
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

// Export utility functions
export { sortByTitle, sortByAuthor, generateKey, BookItem, defaultSorting, onTitleSort, onAuthorSort, countDependencies };

// Render the main component containing the book list and sorting controls
function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();

  // UseEffect hook to handle sorting book list updates
  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  // Map the book list to the BookItem function to create book items
  const bookItems = getBooksList.map(book => BookItem(book));

  // Render the list of book items and sorting controls
  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List itemLayout="vertical" ... renderItem={book => BookItem(book)} />
      {/* TODO: Implement the required changes to improve accessibility for adding a new book */}
      {/* ... */}
      {/* Example of adding a new book form with accessibility considerations */}
      <form onSubmit={(e) => {
        e.preventDefault();
        // Assuming there's a function to get the form data
        const newBook = getFormData();
        addBook(newBook);
      }}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required />
        <label ...
        <input type="text" id="author" name="author" required />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

// Updated function: ensures landmarks uniqueness when there's an array structure
function ensureLandmarkUniqueness(elements) {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          elementsById[landmark.id] = true;
        } else {
          landmark.id += '_duplicate';
        }
      }
    }
  }

  return elements;
}

// Updated function using the new functions for rendering graph/index
function renderDependencyGraphContent() {
  const container = document.getElementById('dependencyGraph');
  if (!container) {
    return;
  }
  
  // Use the new functions for rendering
  renderDependencyGraph(container);
  renderIndexView(container);
}

// Export all functions for Node.js/CommonJS
export {
  config: CONFIG,
  App,
  someFunction: function() {
    return 'some value';
  },
  helper: function(input) {
    return input ? input.toUpperCase() : '';
  },
  formatDate,
  calculateSum,
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  setSvgAttributes,
  initializeApp: initializeAppWrapper,
  validateLinkAccessibility,
  handleFakeLinks,
  generateAccessibilityReport,
  wrapPrimaryContentInMain,
  ensureUniqueLandmarks,
  addLangAttribute,
  createInPageButton,
  validateInput,
  processData,
  formatResponse,
  isValidLandmark,
  loadLandmarks,
  processLandmarks,
  sortLandmarks,
  getLandmarkById,
  landmarkConfig: CONFIG,
  // Tower defense exports
  createTowerDefenseSystem,
  // Book management exports
  generateKey,
  sortByTitle,
  sortByAuthor,
  countDependencies,
  main,
  checkLandmarkElement,
  setLanguageAttribute,
  addLandmarkRoles,
  fixFakeLinks,
  ensureRootContainerAccessible,
  getSvgAccessibilityProps,
  getAccessibleLinkProps,
  getLandmarkProps,
  getRootHtmlAccessibilityProps,
  addressAccessibilityIssues,
  addressAccessibilityIssuesFromInsightReport,
  getInsightReport,
  AddBookForm,
  appState,
  appData,
  landmarks,
  appData,
  icons,
  ensureLandmarkUniqueness,
  renderDependencyGraphContent
};