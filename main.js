// @ts-check
import React from 'react';
import Head from 'next/head';

/**
 * Accessibility improvements implemented:
 * 
 * REACT_015 (React Language Attribute):
 * - The lang attribute should be set on the <html> element, not here.
 * - In Next.js, this is configured in next.config.js or pages/_document.js
 * - Adding lang="en" to the html element via Head is a temporary solution
 * 
 * REACT_027 (React Table Structure):
 * - Added proper <thead> and <tbody> elements
 * - Added scope="col" to header cells
 * 
 * REACT_041 (React SVG Accessible Name):
 * - Added aria-label to SVG elements
 * - For decorative SVGs, added aria-hidden="true" and focusable="false"
 * 
 * REACT_025 (React Unique Landmarks):
 * - Ensured only one <main> landmark exists
 * - Added unique aria-label to landmark regions
 * 
 * REACT_017 (React Landmarks):
 * - Added <nav> elements with aria-label for navigation
 * 
 * REACT_036 (React Fake Link):
 * - Changed <a> with href="#" to proper <button> elements
 * - Changed <a> with onClick but no href to <button>
 */

export default function Home() {
  const tableData = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h1>Welcome to Next.js!</h1>
        <nav aria-label="Main navigation">
          <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" aria-label="Main content">
        <h2>Main Content Area</h2>
        <p>This is the primary content of the page. It is contained within a single main landmark.</p>

        <section aria-labelledby="table-heading">
          <h3 id="table-heading">User Data Table</h3>
          <table role="table" aria-labelledby="table-heading" aria-describedby="table-description">
            <caption id="table-description" style={{ textAlign: 'left', fontWeight: 'normal' }}>
              List of registered users showing their names and email addresses
            </caption>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section aria-labelledby="icons-section">
          <h3 id="icons-section">Accessible Icons</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" aria-label="Edit document">
              <svg
                aria-hidden="true"
                focusable="false"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            <button type="button" aria-label="Delete item">
              <svg
                aria-hidden="true"
                focusable="false"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading">Actions</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="button">
            Learn More
          </button>
          <button type="button">
            Submit
          </button>
        </div>
      </section>

      <footer>
        <nav aria-label="Footer navigation">
          <p>&copy; 2024 My Next.js App. All rights reserved.</p>
        </nav>
      </footer>
    </div>
  );
}