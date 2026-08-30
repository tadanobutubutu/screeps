// main.js
import React from 'react';
import ReactDOM from 'react-dom';

function MyComponent() {
  return (
    <html lang="en">
      <head>
        {/* Other head elements */}
      </head>
      <body>
        <header role="banner">
          {/* Header content */}
        </header>
        <nav role="navigation">
          {/* Navigation links */}
        </nav>
        <main role="main">
          <article role="article">
            <img src="image.png" alt="Descriptive text" />
          </article>
        </main>
        <table>
          <thead>
            <tr>
              <th scope="col">Column 1</th>
              <th scope="col">Column 2</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
          </tbody>
        </table>
        <footer role="contentinfo">
          {/* Footer content */}
        </footer>
      </body>
    </html>
  );
}

export default MyComponent;

ReactDOM.render(<MyComponent />, document.getElementById('root'));