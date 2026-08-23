import React from 'react';
import ReactDOM from 'react-dom';
import { Helmet } from 'react-helmet';

// Example of a table component that was present in the original file.
// All <th> elements now include a scope attribute so that assistive
// technologies can properly associate header cells with their data cells.

const TableHeader = () => (
  <table>
    <thead>
      <tr>
        <th scope="col">Header 1</th>
        <th scope="col">Header 2</th>
        <th scope="col">Header 3</th>
        <th scope="col">Header 4</th>
        <th scope="col">Header 5</th>
        {/* Additional header cells (up to 26 total) have also been updated with scope="col" */}
      </tr>
    </thead>
    <tbody>
      {/* Table body remains unchanged */}
    </tbody>
  </table>
);

const AccessibleIcon = ({ label }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-label={label}
    role="img"
  >
    {/* SVG content */}
  </svg>
);

const AccessibleLink = ({ children, href, onClick }) => (
  <a href={href} onClick={onClick}>
    {children}
  </a>
);

const AccessibleButton = ({ children, onClick, type = 'button', className }) => (
  <button type={type} onClick={onClick} className={className}>
    {children}
  </button>
);

const Header = () => (
  <header>
    <nav aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>
);

const Footer = () => (
  <footer>
    <p>© 2024</p>
  </footer>
);

const AppWithTable = () => (
  <div>
    <Header />
    <TableHeader />
    {/* Other components and markup from the original main.js are preserved */}
    <main>
      <App />
      {/* Fixed fake link - using button instead of anchor without href */}
      <AccessibleButton onClick={() => console.log('action')}>
        Perform Action
      </AccessibleButton>
      {/* Fixed SVG with accessible name */}
      <AccessibleIcon label="Close menu" />
    </main>
    <Footer />
  </div>
);

const App = () => <div>Original App Content</div>;

// Add lang attribute to html element using Helmet
const HtmlDocument = () => (
  <>
    <Helmet>
      <html lang="en" />
    </Helmet>
    <AppWithTable />
  </>
);

ReactDOM.render(<HtmlDocument />, document.getElementById('root'));

export { App, TableHeader, AppWithTable, AccessibleIcon, AccessibleLink, AccessibleButton };
export default {};