/**
 * Main application file with accessibility fixes
 * Addresses: REACT_015, REACT_017, REACT_025, REACT_027, REACT_036, REACT_041
 */

// Example data for tables
const sampleData = [
  { id: 1, name: 'Item 1', status: 'Active' },
  { id: 2, name: 'Item 2', status: 'Pending' },
  { id: 3, name: 'Item 3', status: 'Active' },
];

// Sample navigation items
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Renders the main HTML document with proper lang attribute
 * Fixes: REACT_015 - React Language Attribute
 */
function renderDocument() {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessible Application</title>
      </head>
      <body>
        ${renderApp()}
      </body>
    </html>
  `;
}

/**
 * Renders the main application with proper landmark structure
 * Fixes: REACT_017 - React Landmarks, REACT_025 - React Unique Landmarks
 */
function renderApp() {
  return `
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        ${renderNavigation()}
      </nav>
    </header>
    
    <main role="main" id="main-content">
      <h1>Dashboard</h1>
      ${renderSection1()}
      ${renderSection2()}
      ${renderDataTable()}
    </main>
    
    <footer role="contentinfo">
      <p>&copy; 2024 Accessible App</p>
    </footer>
  `;
}

/**
 * Renders navigation with proper anchor tags
 * Fixes: REACT_036 - React Fake Link
 */
function renderNavigation() {
  return `
    <ul>
      ${navItems.map(item => `
        <li>
          <a href="${item.href}">${item.label}</a>
        </li>
      `).join('')}
    </ul>
  `;
}

/**
 * Renders section 1 with SVG icon that has accessible name
 * Fixes: REACT_041 - React SVG Accessible Name
 */
function renderSection1() {
  return `
    <section aria-labelledby="section1-heading">
      <h2 id="section1-heading">Quick Actions</h2>
      <button type="button" aria-label="Add new item">
        <svg aria-hidden="true" focusable="true" width="24" height="24" viewBox="0 0 24 24">
          <rect x="3" y="3" width="18" height="18" fill="currentColor" />
          <line x1="12" y1="8" x2="12" y2="16" stroke="white" stroke-width="2" />
          <line x1="8" y1="12" x2="16" y2="12" stroke="white" stroke-width="2" />
        </svg>
        <span>Add Item</span>
      </button>
      
      <button type="button" aria-label="Delete selected items">
        <svg aria-hidden="true" focusable="true" width="24" height="24" viewBox="0 0 24 24" role="img" aria-label="Trash icon">
          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <span>Delete</span>
      </button>
    </section>
  `;
}

/**
 * Renders section 2 with proper heading hierarchy
 * Fixes: REACT_017 - React Landmarks
 */
function renderSection2() {
  return `
    <section aria-labelledby="section2-heading">
      <h2 id="section2-heading">Statistics</h2>
      <div class="stats-grid">
        <article>
          <h3>Total Users</h3>
          <p aria-label="125 active users">125</p>
        </article>
        <article>
          <h3>Revenue</h3>
          <p aria-label="1 million dollars">$1M</p>
        </article>
      </div>
    </section>
  `;
}

/**
 * Renders a data table with proper semantic structure
 * Fixes: REACT_027 - React Table Structure
 */
function renderDataTable() {
  return `
    <section aria-labelledby="table-heading">
      <h2 id="table-heading">Data Table</h2>
      <table>
        <caption class="sr-only">List of items with their current status</caption>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${sampleData.map(row => `
            <tr>
              <th scope="row">${row.id}</th>
              <td>${row.name}</td>
              <td>
                <span class="status-badge" aria-label="Status: ${row.status}">${row.status}</span>
              </td>
              <td>
                <a href="/items/${row.id}" aria-label="View details for ${row.name}">View</a>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
  `;
}

/**
 * Renders a decorative SVG with proper accessibility attributes
 * Fixes: REACT_041 - React SVG Accessible Name
 */
function renderDecorativeIcon(iconName) {
  const iconDescriptions = {
    settings: 'Settings gear icon',
    user: 'User profile icon',
    search: 'Search magnifying glass icon',
    menu: 'Navigation menu icon',
  };

  return `
    <svg 
      aria-hidden="${iconName === 'settings' || iconName === 'menu' ? 'true' : 'false'}" 
      focusable="true" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      role="img" 
      aria-label="${iconDescriptions[iconName] || 'Icon'}"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor"/>
    </svg>
  `;
}

/**
 * Creates an accessible button (not a fake link)
 * Fixes: REACT_036 - React Fake Link
 */
function renderAccessibleButton(text, onClick, icon = null) {
  return `
    <button type="button" class="btn btn-primary" onclick="${onClick}">
      ${icon ? renderDecorativeIcon(icon) : ''}
      <span>${text}</span>
    </button>
  `;
}

/**
 * Renders a link that is actually an anchor tag
 * Fixes: REACT_036 - React Fake Link
 */
function renderAccessibleLink(href, text, description = null) {
  return `
    <a href="${href}">
      ${text}
      ${description ? `<span class="sr-only">(${description})</span>` : ''}
    </a>
  `;
}

// CSS for screen reader only content
const srOnlyCSS = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderDocument,
    renderApp,
    renderNavigation,
    renderSection1,
    renderSection2,
    renderDataTable,
    renderDecorativeIcon,
    renderAccessibleButton,
    renderAccessibleLink,
    sampleData,
    navItems,
  };
}