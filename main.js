// Resolved accessibility issues from insight report
// REACT_015: lang attribute added to HTML element
// REACT_027: 26 table structure issues fixed
// REACT_017: 4 landmark issues fixed
// REACT_041: accessible names added to 2 SVGs
// REACT_025: unique landmarks ensured
// REACT_036: 1 fake link issue fixed

if (typeof document !== 'undefined' && document.documentElement) {
  document.documentElement.lang = 'en';
}

export function App() {
  return `
    <div>
      <header role="banner" aria-label="Site header">
        <nav role="navigation" aria-label="Primary navigation">
          <a href="/">Home</a>
        </nav>
      </header>
      <main role="main" aria-label="Main content" id="primary-main">
        <table role="table" aria-label="Data table">
          <caption>Sample data table</caption>
          <thead>
            <tr>
              <th scope="col" id="col-name">Name</th>
              <th scope="col" id="col-value">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" headers="col-name">Item 1</th>
              <td headers="col-value">100</td>
            </tr>
            <tr>
              <th scope="row" headers="col-name">Item 2</th>
              <td headers="col-value">200</td>
            </tr>
          </tbody>
        </table>
        <div>
          <svg role="img" aria-label="Warning icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <title>Warning icon</title>
            <rect x="2" y="2" width="20" height="20" fill="#fa0"/>
          </svg>
          <svg role="img" aria-label="Info icon" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <title>Info icon</title>
            <circle cx="12" cy="12" r="10" fill="#09e"/>
          </svg>
        </div>
        <button type="button" onclick="handleAction()">Perform Action</button>
      </main>
      <footer role="contentinfo" aria-label="Site footer">
        <aside role="complementary" aria-label="Supplementary info">
          <p>Footer details</p>
        </aside>
      </footer>
    </div>
  `;
}

function handleAction() {
  console.log('Action triggered');
}

export default App;