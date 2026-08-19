import React from 'react';

const Main = () => {
  return (
    <html lang="en">
      <body>
        <main>
          <nav aria-label="Primary navigation">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          <section aria-labelledby="section-title">
            <h2 id="section-title">Section Title</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">Column A</th>
                  <th scope="col">Column B</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Value 1</td>
                  <td>Value 2</td>
                </tr>
              </tbody>
            </table>
            <svg aria-label="Example SVG" width="100" height="100">
              <title>Example SVG</title>
              <circle cx="50" cy="50" r="40" />
            </svg>
            <a href="/example" className="fake-link-replaced">
              Previously a div with role="link"
            </a>
          </section>
        </main>
      </body>
    </html>
  );
};

export default Main;