/**
 * main.js — Accessibility improvements (Issue: 87/100 → target 100/100)
 *
 * Fixes applied:
 *   REACT_015 — React Language Attribute  : Added `lang="en"` to <html>
 *   REACT_027 — React Table Structure      : Wrapped table header/body rows in <thead>/<tbody>
 *   REACT_041 — React SVG Accessible Name  : Added role + <title> / aria-label to all SVGs
 *   REACT_025 — React Unique Landmarks    : Ensured each landmark (header, nav, main, footer) appears once
 *   REACT_017 — React Landmarks            : Added explicit <main> and proper landmark hierarchy
 *   REACT_036 — React Fake Link            : Replaced <span onClick> fake links with real <a> elements
 */

import React from 'react';

/**
 * Accessible SVG icon wrapper.
 * REACT_041 — every SVG gets an accessible name via <title> + role="img" + aria-label.
 *
 * @param {object} props
 * @param {string} props.label  – accessible label for the icon
 * @param {React.ReactNode} props.children – SVG path(s)
 * @param {string} [props.className]
 */
export function AccessibleIcon({ label, children, className }) {
  return (
    <svg
      role="img"
      aria-label={label}
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{label}</title>
      {children}
    </svg>
  );
}

/**
 * Accessible data table component.
 * REACT_027 — proper <thead>/<tbody> structure so screen readers can navigate rows/columns.
 *
 * @param {object} props
 * @param {Array<{key:string,label:string}>} props.columns
 * @param {Array<object>} props.rows
 */
export function AccessibleTable({ columns, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col">
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={row.id ?? index}>
            {columns.map((col) => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/**
 * Accessible link component.
 * REACT_036 — replaces fake links (<span onClick>) with real anchor elements.
 *
 * @param {object} props
 * @param {string} props.href
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 */
export function AccessibleLink({ href, children, className }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

/**
 * Main application layout.
 *
 * REACT_015 — <html lang="en">
 * REACT_017 / REACT_025 — single <header>, <nav>, <main>, <footer> landmarks.
 */
export function MainLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav aria-label="Main navigation">
            <AccessibleLink href="#home">Home</AccessibleLink>
            <AccessibleLink href="#about">About</AccessibleLink>
            <AccessibleLink href="#contact">Contact</AccessibleLink>
          </nav>
        </header>
        <main id="main-content">{children}</main>
        <footer>
          <p>&copy; {new Date().getFullYear()} Insight Code Accessibility</p>
        </footer>
      </body>
    </html>
  );
}

/**
 * Default export — renders the full page with accessible table and SVG icons.
 */
export default function Main() {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'status', label: 'Status' },
  ];

  const rows = [
    { id: '1', name: 'Alice', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Bob', role: 'Editor', status: 'Inactive' },
    { id: '3', name: 'Carol', role: 'Viewer', status: 'Active' },
  ];

  return (
    <MainLayout>
      <h1>Accessibility Dashboard</h1>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading">Overview</h2>
        <p>Accessibility score: 100/100</p>

        <AccessibleIcon label="Accessibility check icon">
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </AccessibleIcon>
      </section>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading">Users</h2>
        <AccessibleTable columns={columns} rows={rows} />
      </section>

      <section aria-labelledby="links-heading">
        <h2 id="links-heading">Quick Links</h2>
        <ul>
          <li>
            <AccessibleLink href="#settings">Settings</AccessibleLink>
          </li>
          <li>
            <AccessibleLink href="#profile">Profile</AccessibleLink>
          </li>
        </ul>
      </section>
    </MainLayout>
  );
}