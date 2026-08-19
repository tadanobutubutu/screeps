// Fixed accessibility issues
import React from 'react';

const Main = () => {
  return (
    <div lang="en">
      <header role="banner">
        <h1>My App</h1>
      </header>
      <nav aria-label="Primary">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
        </ul>
      </nav>
      <main role="main">
        <section aria-labelledby="section-title">
          <h2 id="section-title">Section Title</h2>
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
          <svg aria-label="Descriptive text" role="img">
            <circle cx="50" cy="50" r="40" />
          </svg>
          <a href="#" aria-label="Link text">Link</a>
        </section>
      </main>
      <footer role="contentinfo">
        <p>Footer</p>
      </footer>
    </div>
  );
};

export default Main;