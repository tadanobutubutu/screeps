import React from 'react';

const MainPage = () => {
  return (
    <div>
      <React>
        <main id="main-page">
          <header>
            <h1>Welcome to Our Site</h1>
            <nav>
              <ul>
                <li><a href="/home">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </nav>
          </header>

          <section>
            <h2>Features</h2>
            <p>This is a demonstration of accessible markup.</p>

            <table>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Name</th>
                  <th scope="col">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Accessibility</td>
                  <td>Meets WCAG guidelines</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Responsive Design</td>
                  <td>Works on all devices</td>
                </tr>
              </tbody>
            </table>
          </section>

          <footer>
            <p>&copy; 2026 Example Corp. All rights reserved.</p>
          </footer>
        </main>
      </React>
    </div>
  );
};

export default MainPage;