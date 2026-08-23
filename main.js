// main.js - Accessibility fixes applied

import React from 'react';

export default function App({ children }) {
  return (
    <div lang="en">
      <Header />
      <Navigation />
      <MainContent>{children}</MainContent>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header role="banner">
      <h1>Application Title</h1>
      <button 
        type="button"
        aria-label="Open menu"
        onClick={() => {}}
      >
        <svg width="24" height="24" aria-hidden="true">
          <rect x="3" y="4" width="18" height="2" fill="currentColor" />
          <rect x="3" y="10" width="18" height="2" fill="currentColor" />
          <rect x="3" y="16" width="18" height="2" fill="currentColor" />
        </svg>
      </button>
    </header>
  );
}

function Navigation() {
  const links = ['Home', 'About', 'Contact'];
  return (
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        {links.map((link) => (
          <li key={link}>
            <a href={`/${link.toLowerCase()}`}>{link}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function MainContent({ children }) {
  return (
    <main role="main" id="main-content">
      {children}
      <DataTable />
    </main>
  );
}

function DataTable() {
  const data = [
    { id: 1, name: 'Item 1', status: 'Active' },
    { id: 2, name: 'Item 2', status: 'Pending' },
  ];

  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <th scope="row">{row.id}</th>
            <td>{row.name}</td>
            <td>{row.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Footer() {
  return (
    <footer role="contentinfo">
      <p>© 2024 Application</p>
    </footer>
  );
}

// Icon component with proper accessibility
function IconButton({ icon, label, onClick }) {
  return (
    <button type="button" onClick={onClick}>
      {icon}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export { App, Header, Navigation, MainContent, DataTable, Footer };