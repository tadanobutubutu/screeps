export default function Home() {
  return (
    <html lang="en">
      <head>
        <title>My Page</title>
      </head>
      <body>
        <main>
          <h1>Welcome</h1>
          <nav aria-label="Main">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/about">About</a></li>
            </ul>
          </nav>
          
          <section aria-label="Featured Content">
            <h2>Featured</h2>
            <p>Check out our featured items.</p>
          </section>

          <a href="https://example.com" aria-label="Visit Example Website">
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2L2 22h20L12 2z" fill="currentColor"/>
            </svg>
          </a>

          <footer aria-label="Site Footer">
            <p>Footer content</p>
          </footer>
        </main>
      </body>
    </html>
  );
}