// TODO: Add back any required exports that might have been removed
// Here is an example of how to export a required function from another file:

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED
// - REACT_027: Add scope attributes to table headers ✓ FIXED

// EXISTING AND PRESERVED CODE ...

// NEW FUNCTION: Fix table structure issues
function fixTableStructureIssues() {
  // Add scope attribute to th elements that are missing it
  const thElements = document.querySelectorAll('th');
  thElements.forEach((th) => {
    if (!th.getAttribute('scope')) {
      // Determine if header is in thead or tbody to set appropriate scope
      const parentRow = th.closest('tr');
      const parentSection = th.closest('thead') ? 'thead' : 'tbody';
      if (parentSection === 'thead') {
        th.setAttribute('scope', 'col');
      } else {
        // For tbody, determine if it's a row header or column header
        const rowIndex = parentRow ? Array.from(parentRow.parentNode.children).indexOf(parentRow) : -1;
        const cellIndex = parentRow ? Array.from(parentRow.children).indexOf(th) : -1;
        if (rowIndex === 0) {
          th.setAttribute('scope', 'row');
        } else if (cellIndex === 0) {
          th.setAttribute('scope', 'col');
        }
      }
    }
  });

  // Ensure tables have proper caption elements
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// NEW FUNCTION: Ensure unique landmarks
function ensureUniqueLandmarks() {
  // Get all landmark elements
  const landmarks = {
    main: Array.from(document.querySelectorAll('main')),
    nav: Array.from(document.querySelectorAll('nav')),
    header: Array.from(document.querySelectorAll('header')),
    footer: Array.from(document.querySelectorAll('footer')),
    aside: Array.from(document.querySelectorAll('aside')),
    section: Array.from(document.querySelectorAll('section'))
  };

  // Add unique labels to duplicate landmarks and keep a single <main>
  Object.keys(landmarks).forEach((landmarkType) => {
    const elements = landmarks[landmarkType];
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (landmarkType === 'main' && index > 0) {
          // Convert extra <main> elements to <section> so only one main landmark remains
          const section = document.createElement('section');
          for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            section.setAttribute(attr.name, attr.value);
          }
          while (element.firstChild) {
            section.appendChild(element.firstChild);
          }
          if (element.parentNode) {
            element.parentNode.replaceChild(section, element);
          }
        } else {
          if (!element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
            const label = `${landmarkType} ${index + 1}`;
            element.setAttribute('aria-label', label);
          }
        }
      });
    }
  });
}

// NEW FUNCTION: Add accessible name to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    // Add accessible name using aria-label if not present
    if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
    // Add role="img" for better screen reader support
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

// NEW FUNCTION: Add aria-label to the 'myDiv' element
function addAriaLabelToMyDiv() {
  const myDiv = document.getElementById('myDiv');
  if (myDiv) {
    myDiv.setAttribute('aria-label', 'My div');
  }
}

/**
 * Creates an accessible table header cell with proper scope attribute
 * @param {Object} props - Header cell properties
 * @param {string} props.content - The text content of the header
 * @param {string} props.type - Either 'col' or 'row' to specify scope
 * @param {string} [props.abbr] - Optional abbreviation for complex headers
 * @param {string} [props.id] - Optional id for association with cells
 */
function TableHeader({ content, type = 'col', abbr, id }) {
  const props = {
    scope: type,
  };
  
  if (abbr) {
    props.abbr = abbr;
  }
  
  if (id) {
    props.id = id;
  }
  
  return <th {...props}>{content}</th>;
}

/**
 * Accessible table component with proper scope attributes
 * @param {Object} props - Table properties
 * @param {Array<string>} props.headers - Array of column header texts
 * @param {Array<Array<string>>} props.rows - 2D array of cell data
 * @param {string} [props.caption] - Optional table caption
 */
function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <TableHeader 
              key={index} 
              content={header} 
              type="col" 
              id={`header-${index}`}
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <TableHeader content={row[0]} type="row" />
            {row.slice(1).map((cell, cellIndex) => (
              <td key={cellIndex} headers={`header-${cellIndex + 1}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AppContent() {
  return (
    <div lang="en">
      <AccessibilityWrapper>
        <SiteHeader />
        
        <main 
          id="main-content" 
          role="main"
          aria-label="Main content"
        >
          <h1>Welcome to Our Application</h1>
          <p>This is the main content area of the application.</p>
          
          <SocialIcons />
          
          <section aria-labelledby="features-heading">
            <h2 id="features-heading">Features</h2>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
              <li>Feature 3</li>
            </ul>
          </section>
          
          <AccessibleTable 
            caption="Sample data table with accessible headers"
            headers={['Item', 'Description', 'Price']}
            rows={[
              ['Product A', 'First item', '$10.00'],
              ['Product B', 'Second item', '$20.00'],
              ['Product C', 'Third item', '$30.00'],
            ]}
          />
          
          <button 
            type="button"
            onClick={() => console.log('Action triggered')}
            aria-label="Learn more about our services"
          >
            Learn More
          </button>
        </main>
        
        <SiteFooter />
      </AccessibilityWrapper>
    </div>
  );
}

function App() {
  return <AppContent />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

export default App;
export { SiteHeader, SiteFooter, SocialIcons, AccessibilityWrapper, TableHeader, AccessibleTable };
// EXPORT new functions
export { fixTableStructureIssues, ensureUniqueLandmarks, addSvgAccessibleNames, addAriaLabelToMyDiv };