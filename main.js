// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (Updated code added below)
// - REACT_036: Fix 1 fake link issue

export function renderApp() {
  const root = document.getElementById('root');
  root.innerHTML = `
    <div class="app">
      <nav class="navigation">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <span class="fake-link" onclick="doSomething()">Click me</span>
      </nav>
      <header>
        <h1>Welcome</h1>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <circle cx="12" cy="12" r="10" fill="#333"/>
        </svg>
        <svg viewBox="0 0 24 24" width="24" height="24">
          <rect x="2" y="2" width="20" height="20" fill="#666"/>
        </svg>
      </header>
      <main>
        <section>
          <h2>Content</h2>
          <p>Main content area</p>
        </section>
        <section>
          <h2>More Content</h2>
          <p>Additional content</p>
        </section>
      </main>
      <footer>
        <p>&copy; 2024</p>
      </footer>
    </div>
  `;
}

export function doSomething() {
  console.log('Action performed');
}

export default { renderApp, doSomething };