import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { createAccessibleSvg } from './createAccessibleSvg';

// Add this function to create an accessible SVG element
function createAccessibleSvg(props) {
  return (
    <svg
      {...props}
      aria-hidden={props['aria-hidden'] || "true"}
      role={props.role || "img"}
    >
      {props.children}
    </svg>
  );
}

// Add landmarks function
function addLandmarks() {
  // Add main landmark if not present
  if (!document.querySelector('main')) {
    const mainElement = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      // Move all existing content into the main element
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }

  // Ensure main has proper role
  const mainContent = document.querySelector('main');
  if (mainContent && !mainContent.getAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  }
}

// Example of adding language attribute to root element
function App() {
  return (
    <div lang="en">
      {/* Your existing content */}
    </div>
  );
}

// Example of a proper table structure
function DataTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Header 1</th>
          <th scope="col">Header 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.col1}</td>
            <td>{item.col2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example of adding landmarks
function Layout() {
  return (
    <div>
      <header role="banner">
        {/* Header content */}
      </header>
      <main role="main">
        {/* Main content */}
      </main>
      <nav role="navigation">
        {/* Navigation content */}
      </nav>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// Example of an accessible SVG
function Icon() {
  return (
    <svg aria-label="Example icon" width="24" height="24">
      {/* SVG content */}
    </svg>
  );
}

// Example of a proper link
function ButtonLink() {
  return (
    <a href="/destination" role="button">
      Click me
    </a>
  );
}

// Preserve all existing exports
export default App;
export { DataTable, Layout, createAccessibleSvg, Icon, ButtonLink };
// ... any other existing exports

// Main render function
function main() {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(<App />);
}

// Starting the application
main();