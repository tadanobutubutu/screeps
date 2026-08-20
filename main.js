// Updated to address accessibility issues
import { useEffect } from 'react';

const Main = () => {
  useEffect(() => {
    // Set language attribute for screen readers (REACT_015)
    document.documentElement.lang = 'en';
  }, []);

  return (
    <main>
      {/* Landmarks: header, nav, main, footer (REACT_017, REACT_025) */}
      <header>
        <h1>Application</h1>
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
          <a href="/about">About</a>
        </nav>
      </header>

      <section aria-labelledby="table-heading">
        <h2 id="table-heading">User Table</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>John Doe</td>
              <td>john@example.com</td>
            </tr>
            <tr>
              <td>Jane Smith</td>
              <td>jane@example.com</td>
            </tr>
          </tbody>
        </table>
      </section>

      <footer>
        <svg aria-label="Logo" width="50" height="50">
          <circle cx="25" cy="25" r="20" />
        </svg>
      </footer>
    </main>
  );
};

export default Main;