import React from 'react';
import ReactDOM from 'react-dom/root';
import App from './App';
import './index.css';
import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/router';

// First, let's add necessary import
// (Removed duplicate import of useRouter)

// Existing code (preserved)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function to handle main content rendering
export function renderMainContent(content) {
  return (
    // Changed from <main> to <section> to fix REACT_025 - React Unique Landmarks
    <section className="main-content">
      {content}
    </section>
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
  const tableHeaders = ['ID', 'Name', 'Email'];
  const tableRows = data.map((row) => (
    <tr key={row.id}>
      {tableHeaders.map((header, index) => (
        <Table.Cell key={index}>
          {header === 'ID' ? row.id : header === 'Name' ? row.name : row.email}
        </Table.Cell>
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
              <a href={route.path}>{route.name}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

// Assuming this is the file that renders the root HTML element
function renderApp() {
  // ... other code ...

  // Render the root HTML element with the lang attribute
  ReactDOM.render(
    <html lang="en">
      <head>
        {/* ... other head elements ... */}
      </head>
      <body>
        {/* ... other body elements ... */}
      </body>
    </html>,
    document.getElementById('root')
  );
}

renderApp();