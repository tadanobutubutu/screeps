const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0'
};

const landmarks = [];

const appData = {
    title: 'Frontend Application',
    version: '1.0.0'
};

let icons = {};

const primaryContent = document.querySelector('.primary-content') ||
                        document.querySelector('[role="main"]') ||
                        document.getElementById('main-content') ||
                        document.querySelector('#content');

function wrapPrimaryContentInMain() {
  if (primaryContent && !primaryContent.closest('main')) {
    const mainElement = document.createElement('main');
    primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    mainElement.appendChild(primaryContent);
    return mainElement;
  }
  return null;
}

function enhanceAccessibilityForAddBook(form) {
  if (!form) return;
  
  if (!form.getAttribute('role')) {
    form.setAttribute('role', 'form');
  }
  
  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    const id = input.id || input.getAttribute('name');
    if (!input.getAttribute('aria-label') && !form.querySelector(`label[for="${id}"]`)) {
      const label = form.querySelector(`label[for="${input.id}"]`) || form.querySelector(`label[for="${input.name}"]`);
      if (!label) {
        input.setAttribute('aria-label', input.name || 'Form input');
      }
    }
    
    if (input.hasAttribute('required')) {
      input.setAttribute('aria-required', 'true');
    }
  });
  
  const submitButton = form.querySelector('button[type="submit"]');
  if (submitButton && !submitButton.getAttribute('aria-label') && !submitButton.textContent.trim()) {
    submitButton.setAttribute('aria-label', 'Submit form');
  }
  
  return form;
}

function validateLandmark(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.name || typeof landmark.name !== 'string' || landmark.name.trim() === '') {
    errors.push('Landmark must have a valid name');
  }

  const HTML = ({ lang }) => `<html lang="${lang}">${/* other children */ ''}</html>`;

  if (landmark.latitude === undefined || landmark.latitude === null) {
    errors.push('Landmark must have a latitude');
  } else if (typeof landmark.latitude !== 'number' || isNaN(landmark.latitude)) {
    errors.push('Landmark latitude must be a number');
  } else if (landmark.latitude < -90 || landmark.latitude > 90) {
    errors.push('Landmark latitude must be between -90 and 90');
  }

  if (landmark.longitude === undefined || landmark.longitude === null) {
    errors.push('Landmark must have a longitude');
  } else if (typeof landmark.longitude !== 'number' || isNaN(landmark.longitude)) {
    errors.push('Landmark longitude must be a number');
  } else if (landmark.longitude < -180 || landmark.longitude > 180) {
    errors.push('Landmark longitude must be between -180 and 180');
  }

  if (Array.isArray(landmark) && landmark.length > 0) {
    if (!landmark[0].name || typeof landmark[0].name !== 'string' || landmark[0].name.trim() === '') {
      errors.push('Landmark array must have a name');
    }
  }

  if (Array.isArray(landmark)) {
    landmark.forEach(innerLandmark => {
      if (!innerLandmark.name || typeof innerLandmark.name !== 'string' || innerLandmark.name.trim() === '') {
        errors.push('Landmark array must have valid names');
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function validateLandmarkStructure(landmark) {
  const errors = [];

  if (!landmark) {
    errors.push('Landmark is required');
    return { valid: false, errors };
  }

  if (!landmark.role) {
    errors.push('Landmark must have a role');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function getSvgAccessibleName(svgElement) {
    if (!svgElement) return 'Accessible SVG Icon';
    const title = svgElement.querySelector('title');
    const ariaLabel = svgElement.getAttribute('aria-label');
    if (title) return title.textContent;
    if (ariaLabel) return ariaLabel;
    return 'Accessible SVG Icon';
}

function checkLandmarkElement(id) {
  const element = document.getElementById(id);
  return element !== null;
}

function ensureUniqueLandmarks(landmarksArray) {
  if (!landmarksArray || landmarksArray.length === 0) {
      return {};
  }
  const seen = new Set();
  return landmarksArray.filter(landmark => {
    const key = landmark.name + '_' + (landmark.role || 'default');
    if (seen.has(key)) {
        return false;
    }
    seen.add(key);
    return true;
  });
}

function ensureLandmarkUniqueness(elements) {
  const landmarkTypes = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];
  const elementsById = {};

  if (Array.isArray(elements)) {
    for (const landmark of elements) {
      if (landmark.id) {
        if (elementsById[landmark.id]) {
          landmark.id += '_duplicate';
        } else {
          elementsById[landmark.id] = true;
        }
      }
    }
  }

  return elements;
}

function ensureFocusableElements(container) {
  if (!container) return;

  const focusableSelectors = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
  const focusableElements = container.querySelectorAll(focusableSelectors);

  focusableElements.forEach((el, index) => {
    if (!el.getAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
  });

  return focusableElements;
}

function createInPageButton(buttonsData) {
  const buttonsContainer = document.getElementById('in-page-buttons-container');

  if (!buttonsContainer) {
    console.error('In-page buttons container not found');
    return;
  }

  buttonsData.forEach(buttonData => {
    const button = document.createElement('button');
    button.id = buttonData.id;
    button.textContent = buttonData.text;
    button.setAttribute('data-role', buttonData.role);

    button.addEventListener('click', () => {
      location.hash = buttonData.href;
    });

    buttonsContainer.appendChild(button);
  });
}

function createAccessibleButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    button.setAttribute('aria-label', text);
    return button;
}

function setLanguageAttribute(document, lang) {
  if (document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
}

function addLandmarkRoles(container) {
  if (!container) return;

  const possibleLandmarks = {
    'nav': 'navigation',
    'aside': 'complementary',
    'section': 'region',
    'form': 'form'
  };

  const sections = container.querySelectorAll('nav, aside, section, form');
  sections.forEach(section => {
    if (!section.getAttribute('role') && possibleLandmarks[section.tagName.toLowerCase()]) {
      section.setAttribute('role', possibleLandmarks[section.tagName.toLowerCase()]);
    }
  });
}

function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.lang) {
    htmlElement.lang = 'en';
  }
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const cells = firstRow.querySelectorAll('th, td');
        cells.forEach(cell => {
          const newTh = document.createElement('th');
          newTh.textContent = cell.textContent;
          if (cell.hasAttribute('colspan')) {
            newTh.setAttribute('colspan', cell.getAttribute('colspan'));
          }
          if (cell.hasAttribute('rowspan')) {
            newTh.setAttribute('rowspan', cell.getAttribute('rowspan'));
          }
          newTh.setAttribute('scope', 'col');
          headerRow.appendChild(newTh);
        });
        thead.appendChild(headerRow);
        table.insertBefore(thead, table.firstChild);
      }
    }
    if (!table.querySelector('tbody')) {
      const rows = table.querySelectorAll('tr');
      const thead = table.querySelector('thead');
      const rowsAfterHeader = thead ? Array.from(rows).slice(1) : Array.from(rows);
      if (rowsAfterHeader.length > 0) {
        const tbody = document.createElement('tbody');
        rowsAfterHeader.forEach(row => {
          tbody.appendChild(row);
        });
        table.appendChild(tbody);
      }
    }
  });
}

function addMainLandmark() {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.id = 'main-content';
    const existingContent = document.body.firstElementChild;
    if (existingContent) {
      document.body.insertBefore(mainElement, existingContent);
    } else {
      document.body.appendChild(mainElement);
    }
  } else {
    if (!mainElement.id) {
      mainElement.id = 'main-content';
    }
    if (!mainElement.hasAttribute('role') || mainElement.getAttribute('role') !== 'main') {
      mainElement.setAttribute('role', 'main');
    }
  }
}

function ensureUniqueLandmarksDoc() {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach(role => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      let isFirst = true;
      elements.forEach(element => {
        if (isFirst) {
          isFirst = false;
        } else {
          element.removeAttribute('role');
        }
      });
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = `svg-title-${index}`;
      title.id = titleId;
      svg.setAttribute('aria-labelledby', titleId);
    } else {
      const fallbackId = `svg-fallback-title-${index}`;
      const newTitle = document.createElement('title');
      newTitle.id = fallbackId;
      newTitle.textContent = `SVG image ${index + 1}`;
      svg.insertBefore(newTitle, svg.firstChild);
      svg.setAttribute('aria-labelledby', fallbackId);
    }
  });
}

function fixFakeLinkIssue() {
  const anchors = document.querySelectorAll('a');
  anchors.forEach(anchor => {
    if (!anchor.href || anchor.href === '#' || anchor.href === '' || anchor.href === 'javascript:;') {
      const text = anchor.textContent.trim();
      const button = document.createElement('button');
      button.textContent = text;
      Array.from(anchor.attributes).forEach(attr => {
        if (attr.name !== 'href' && attr.name !== 'onclick') {
          button.setAttribute(attr.name, attr.value);
        }
      });
      anchor.parentNode.replaceChild(button, anchor);
    }
  });
}

function fixFakeLinks(container) {
  if (!container) return;

  const fakeLinks = container.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'button');
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  });
}

function validateSvgAccessibility(svg) {
  const errors = [];

  if (!svg) {
    errors.push('SVG element is required');
    return { valid: false, errors };
  }

  const accessibleName = svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title');
  if (!accessibleName) {
    errors.push('SVG must have an accessible name via aria-label, aria-labelledby, or title element');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

function processUniqueElements(elements) {
  if (!Array.isArray(elements)) {
    return [];
  }

  const uniqueElements = [];
  const seen = new Map();

  elements.forEach(element => {
    const key = element.id || element.name || JSON.stringify(element);
    if (!seen.has(key)) {
      seen.set(key, true);
      uniqueElements.push(element);
    }
  });

  return uniqueElements;
}

function addressInsightIssues(document) {
  const issues = [];

  if (!document.documentElement.lang) {
    setLanguageAttribute(document, 'en');
    issues.push('lang attribute added');
  }

  const mainLandmark = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!mainLandmark) {
    issues.push('main landmark added');
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG image';
      svg.insertBefore(title, svg.firstChild);
      issues.push('SVG accessible name added');
    }
  });

  return issues;
}

function renderDependencyGraph(container) {
  if (!container) return;
  console.log('Rendering dependency graph');
}

function renderIndexView(container) {
  if (!container) return;
  console.log('Rendering index view');
}

function addLandmarkRegions(container) {
  if (!container) return [];
  
  const regions = ['main', 'navigation', 'banner', 'contentinfo', 'complementary'];
  const addedRegions = [];
  
  regions.forEach(role => {
    const existing = container.querySelector(`[role="${role}"]`);
    if (!existing) {
      const region = document.createElement('div');
      region.setAttribute('role', role);
      container.appendChild(region);
      addedRegions.push(role);
    }
  });
  
  return addedRegions;
}

function processAccessibilityIssues(document) {
  const issues = [];
  
  if (!document.documentElement.lang) {
    issues.push('Missing lang attribute on html element');
  }
  
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    issues.push('Missing main landmark');
  }
  
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const hasAccessibleName = svg.getAttribute('aria-label') || 
                             svg.getAttribute('aria-labelledby') || 
                             svg.querySelector('title');
    if (!hasAccessibleName) {
      issues.push(`SVG at index ${index} missing accessible name`);
    }
  });
  
  return issues;
}

function validateLandmarkAttributes(container) {
  const errors = [];
  
  if (!container) {
    errors.push('Container is required');
    return { valid: false, errors };
  }
  
  const landmarkElements = container.querySelectorAll('[role]');
  const validRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'];
  
  landmarkElements.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (!validRoles.includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function landmarkStructureCheck(container) {
  if (!container) return { valid: false, errors: ['Container is required'] };
  const landmarksInContainer = container.querySelectorAll('[role]');
  const errors = [];
  landmarksInContainer.forEach(lm => {
    const role = lm.getAttribute('role');
    if (!['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form'].includes(role)) {
      errors.push(`Invalid landmark role: ${role}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

function setLanguageAttributeForElement(element, lang) {
  if (element && typeof lang === 'string' && lang.length > 0) {
    element.setAttribute('lang', lang);
    return true;
  }
  return false;
}

function addLandmarkRolesToElements(elements) {
  if (!Array.isArray(elements)) return [];
  return elements.map(el => {
    if (el.tagName) {
      const tag = el.tagName.toLowerCase();
      const roleMap = { nav: 'navigation', main: 'main', footer: 'contentinfo', aside: 'complementary' };
      if (roleMap[tag] && !el.getAttribute('role')) {
        el.setAttribute('role', roleMap[tag]);
      }
    }
    return el;
  });
}

function fixLinksAsButtons(links) {
  if (!Array.isArray(links)) return [];
  return links.map(link => {
    if (link.href && !link.getAttribute('role')) {
      if (link.href.startsWith('#') || link.href === '') {
        link.setAttribute('role', 'button');
      }
    }
    return link;
  });
}

function isSecureContext() {
  return window.isSecureContext === true || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
}

function initialize() {
  landmarks.length = 0;
}

function main() {
  initialize();
  console.log('Main function executed');
}

function VisualizeDependencyTree(data) {
  console.log('Visualizing dependency tree:', data);
}

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

export function addBook(book) {
  dispatch({ type: 'ADD_BOOK', payload: book });
}

ensureDependencyGraphAriaRole();

const defaultSorting = sortByTitle;

function onTitleSort() {
  const sortedList = [...getBooksList].sort(sortByTitle);
  dispatch({ type: 'SORT_BY_TITLE', payload: sortedList });
}

function onAuthorSort() {
  const sortedList = [...getBooksList].sort(sortByAuthor);
  dispatch({ type: 'SORT_BY_AUTHOR', payload: sortedList });
}

function Main() {
  const [sorting, setSorting] = useState(defaultSorting);
  const dispatch = useDispatch();

  useEffect(() => {
    if (sorting === sortByTitle) {
      onTitleSort();
    } else if (sorting === sortByAuthor) {
      onAuthorSort();
    }
  }, [sorting]);

  const bookItems = getBooksList.map(book => BookItem(book));

  return (
    <div>
      <button onClick={() => setSorting(sortByTitle)}>Sort by Title</button>
      <button onClick={() => setSorting(sortByAuthor)}>Sort by Author</button>
      <List itemLayout="vertical" dataSource={getBooksList} renderItem={book => BookItem(book)} />
      <form onSubmit={(e) => {
        e.preventDefault();
        const newBook = getFormData();
        addBook(newBook);
      }}>
        <label htmlFor="title">Title:</label>
        <input type="text" id="title" name="title" required aria-label="Book title" />
        <label htmlFor="author">Author:</label>
        <input type="text" id="author" name="author" required aria-label="Book author" />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
}

export {
  getLangAttribute,
  getFullLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  fixTableStructure,
  addMainLandmark,
  validateLandmark,
  validateLandmarkStructure,
  validateLandmarkAttributes,
  getSvgAccessibleName,
  setSvgAttributes,
  ensureUniqueLandmarks,
  ensureLandmarkUniqueness,
  createInPageButton,
  createAccessibleButton,
  validateLinkAccessibility,
  handleFakeLinks,
  addLandmarkRegions,
  processAccessibilityIssues,
  initialize,
  initializeApp,
  processData,
  fetchUser,
  clearCache,
  validateInput,
  main,
  wrapPrimaryContentInMain,
  handleUserInteraction,
  cleanup,
  initApp,
  VisualizeDependencyTree,
  checkLandmarkElement,
  ensureFocusableElements,
  validateSvgAccessibility,
  processUniqueElements,
  addressInsightIssues,
  renderDependencyGraph,
  renderIndexView,
  calculateSum,
  addProperLandmarkRegions,
  fixFakeLinkIssue,
  addSvgAccessibleNames,
  ensureUniqueLandmarksDoc,
  fixButtonIdentifiers,
  ensureDependencyGraphAriaRole,
  googleSignIn,
  enhanceAccessibilityForAddBook,
  landmarkStructureCheck,
  setLanguageAttributeForElement,
  addLandmarkRolesToElements,
  fixLinksAsButtons,
  isSecureContext,
  appData,
  config,
  landmarks,
  icons,
  countDependencies,
  addBook,
  BookItem,
  defaultSorting,
  onTitleSort,
  onAuthorSort,
  Main
};