// Accessibility fixes applied for Insight Code scan
// REACT_015 React Language Attribute
// REACT_017 React Landmarks
// REACT_025 React Unique Landmarks
// REACT_027 React Table Structure
// REACT_036 React Fake Link
// REACT_041 React SVG Accessible Name

export const API_VERSION = '1.0.0';

export const getConfig = () => ({
  endpoint: '/api/data',
});

export const processRows = (rows) => rows.map((r) => ({ ...r }));

export default function Main() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Accessible Main</title>
      </head>
      <body>
        <div id="root">
          {/* REACT_017: Ensure landmarks exist */}
          <header role="banner" aria-label="Site header">
            <h1>Accessible App</h1>
          </header>

          {/* REACT_025: Unique landmark labels */}
          <nav aria-label="Primary navigation" role="navigation">
            <a href="/">Home</a>
            <a href="/about">About</a>
          </nav>

          <nav aria-label="Secondary navigation" role="navigation">
            <a href="/contact">Contact</a>
          </nav>

          <main role="main" aria-label="Main content">
            {/* REACT_027: Proper table structure */}
            <table>
              <caption>User List</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Role</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Alice</th>
                  <td>Admin</td>
                </tr>
                <tr>
                  <th scope="row">Bob</th>
                  <td>Editor</td>
                </tr>
              </tbody>
            </table>

            {/* REACT_041: SVG accessible name */}
            <svg
              width="24"
              height="24"
              aria-label="Check icon"
              role="img"
              viewBox="0 0 24 24"
            >
              <title>Check icon</title>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>

            {/* REACT_036: Real link with href */}
            <a href="/details">View Details</a>
          </main>

          <aside aria-label="Sidebar" role="complementary">
            <h2>Sidebar</h2>
          </aside>

          <footer role="contentinfo" aria-label="Site footer">
            <p>Footer content</p>
          </footer>
        </div>
      </body>
    </html>
  );
}

export { Main as Component };