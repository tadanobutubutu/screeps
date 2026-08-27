// main.js
export default function App() {
  // Fixed fake link: changed href from "#" to "#top"
  const links = [
    { text: 'Home', href: '#top' },
    { text: 'About', href: 'https://example.com/about' }
  ];

  return (
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Main App</title>
      </head>
      <body>
        <header lang="header">
          <h1 lang="en">Welcome to My App</h1>
        </header>

        <nav aria-label="Primary Navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>

        <main>
          <article>
            <p>This is the main content of the application.</p>
          </article>
        </main>

        <footer lang="footer">
          <p>&copy; 2023 My Company</p>
        </footer>
      </body>
    </html>
  );
}