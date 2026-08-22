// main.js
// This file contains the main application logic with accessibility improvements

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <MainContent />
        <Footer />
        <NextScript />
      </body>
    </Html>
  );
}

function Header() {
  return (
    <header role="banner">
      <nav role="navigation" aria-label="Main navigation">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function MainContent() {
  return (
    <main id="main-content" role="main">
      <h1>Accessible Data Table Example</h1>
      <DataTable />
    </main>
  );
}

function DataTable() {
  const data = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Inactive' },
    { id: 3, name: 'Item 3', status: 'Active' },
  ];

  return (
    <div role="region" aria-labelledby="table-heading">
      <h2 id="table-heading">Data List</h2>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Footer() {
  return (
    <footer role="contentinfo">
      <nav aria-label="Footer navigation">
        <ul>
          <li>
            <a href="/privacy">Privacy Policy</a>
          </li>
          <li>
            <button type="button">Contact Us</button>
          </li>
        </ul>
      </nav>
      <AccessibleIcon />
    </footer>
  );
}

function AccessibleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Information icon"
    >
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
        fill="currentColor"
      />
    </svg>
  );
}

// Export all functions for testing
export { Header, MainContent, DataTable, Footer, AccessibleIcon };