export default function Main() {
  // REACT_015: Add lang attribute to HTML element
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('lang', 'en');
  }

  return (
    <div>
      {/* REACT_017: Add/fix landmark issues */}
      <header role="banner">
        <h1>App</h1>
      </header>

      {/* REACT_025: Ensure unique landmarks */}
      <nav aria-label="Primary navigation">
        <a href="/">Home</a>
      </nav>

      <nav aria-label="Secondary navigation">
        <a href="/about">About</a>
      </nav>

      <main>
        <h2>Content</h2>

        {/* REACT_036: Fix fake link issue */}
        <a href="/target" className="link">Real Link</a>

        {/* REACT_041: Add accessible names to 2 SVGs */}
        <svg aria-label="First icon" role="img" width="24" height="24">
          <title>First icon</title>
        </svg>

        <svg aria-label="Second icon" role="img" width="24" height="24">
          <title>Second icon</title>
        </svg>
      </main>

      <footer>
        <p>Footer</p>
      </footer>
    </div>
  );
}