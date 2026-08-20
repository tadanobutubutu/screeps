import React from 'react';

const Main = () => {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Accessible Page</title>
      </head>
      <body>
        <main>
          <h1>Welcome</h1>
          <nav aria-label="Primary">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          <section aria-labelledby="section1">
            <h2 id="section1">Section</h2>
            <table>
              <thead>
                <tr>
                  <th scope="col">Header 1</th>
                  <th scope="col">Header 2</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Cell 1</td>
                  <td>Cell 2</td>
                </tr>
              </tbody>
            </table>
            <svg aria-label="Sample" width="100" height="100">
              <circle cx="50" cy="50" r="40" />
            </svg>
          </section>
        </main>
      </body>
    </html>
  );
};

export default Main;

function FaviconSVG() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="My Favicon"
    >
      {/* Favicon code */}
    </svg>
  );
}

export { FaviconSVG } from './path/to/FaviconSVG';