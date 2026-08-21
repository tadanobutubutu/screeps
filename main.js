/*
Could you please paste the contents of `main.js`, especially the sections with conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), so I can help resolve them?
*/
import React from 'react';
import Head from 'next/head';
import styles from './styles/Home.module.css';

// Ensure the HTML element has a language attribute (REACT_015)
function Root() {
  return (
    <>
      <Html lang="en">
        <body>
          {/* Header & Navigation (landmark) */}
          <header>
            <nav>
              <a href="/" className={styles.navLink}>
                Home
              </a>
              <a href="/about" className={styles.navLink}>
                About
              </a>
            </nav>
          </header>

          {/* Main content */}
          <main>
            {/* Accessible table (REACT_027) */}
            <section>
              <h2>Data Table</h2>
              <table className={styles.table}>
                <caption>Sample Data</caption>
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Age</th>
                    <th scope="col">City</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Doe</td>
                    <td>30</td>
                    <td>New York</td>
                  </tr>
                  <tr>
                    <td>Jane Smith</td>
                    <td>25</td>
                    <td>Los Angeles</td>
                  </tr>
                </tbody>
              </table>
            </section>

            {/* SVG with accessible name (REACT_041) */}
            <section>
              <h2>Icon</h2>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                aria-labelledby="icon-title"
                role="img"
              >
                <title id="icon-title">Close</title>
                <path d="M19 6.41L16.59 3 12 14l5.41 5.41L10.59 18.59 6 12 10.59 6 15.59 10.59L13.41 3 9.59 6.41 5.18 3 16.59 9.59L19 6.41Z" />
              </svg>
            </section>

            {/* Proper link (REACT_036) */}
            <section>
              <h2>Link</h2>
              <a href="/contact" className={styles.link}>
                Contact Us
              </a>
            </section>
          </main>

          {/* Footer (landmark) */}
          <footer>
            <p>&copy; {new Date().getFullYear()} My Company</p>
          </footer>
        </body>
      </Html>
    </>
  );
}

export default Home;