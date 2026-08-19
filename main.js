// main.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// For app/layout.tsx
const AppLayout = ({ children }) => (
  <body className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </body>
);

// For dashboard/app/layout.tsx
const DashboardLayout = ({ children }) => (
  <body>
    <main>{children}</main>
  </body>
);

// For docs/dependency-graph.html
const DependencyGraph = () => (
  <main>
    <table id="table-rotated">
      {/* Table content */}
    </table>
  </main>
);

// For docs/index.html
const DocsIndex = () => (
  <main>
    <div className="container">
      <h2>Quality & Metrics Reports</h2>
      <p>
        This repository is fully optimized with automated tools. Explore the generated
        reports below:
      </p>
      <div className="links">
        <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
        <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
      </div>
    </div>
  </main>
);

// Main application render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Export all components
export { AppLayout, DashboardLayout, DependencyGraph, DocsIndex };

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    <main className="main-content">
      {content}
    </main>
  );
}

// Existing exports (preserved)
export const existingExport1 = () => {
  // existing implementation
};

export const existingExport2 = () => {
  // existing implementation
};

export const newFeature = () => {
  // implementation for new feature
};

// Table component from origin/main
function MyTable() {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
    { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
    // More data rows...
  ]);

  // Addressing REACT_027 - React Table Structure
  const tableHeaders = Object.keys(data[0]);
  const tableRows = data.map((row) => (
    <tr key={row.id}>
      {tableHeaders.map((header) => (
        <Table.Cell key={`cell-${header}-${row.id}`}>{row[header]}</Table.Cell>
      ))}
    </tr>
  ));

  return (
    // Addressing REACT_015 - React Language Attribute
    // Add lang attribute to div for accessibility
    <div lang="en">
      <h1>Users List</h1>
      <Table>
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              // Add aria-label for table headers for screen reader accessibility
              <th key={`th-${header}`} aria-label={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </div>
  );
}

// Export default Main component
export default function Main() {
  const router = useRouter();

  return (
    <>
      <h1>My Page</h1>
      <MyTable />
      {/* More components... */}

      {/* Add landmark for main content */}
      <main id="main-content">
        {/* Component content here */}
      </main>

      {/* Add landmark for footer */}
      <footer id="footer">
        {/* Footer content here */}
      </footer>

      {/* Navigation landmarks */}
      <nav aria-label="Main Navigation">
        <ul>
          {router.routes.map((route) => (
            <li key={route.id}>
              <a href={route.asPath}>{route.id}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}