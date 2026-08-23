// main.js
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue
// - REACT_027: Add scope attribute to th elements

export function renderApp() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application</title>
</head>
<body>
  <header role="banner">
    <nav role="navigation" aria-label="Main navigation">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
      </ul>
    </nav>
  </header>

  <main role="main" id="main-content">
    <h1>Welcome</h1>
    
    <svg aria-label="Decorative icon" viewBox="0 0 24 24" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="blue" />
    </svg>

    <svg aria-label="Chart icon" viewBox="0 0 24 24" width="24" height="24">
      <rect x="2" y="10" width="6" height="12" fill="green" />
      <rect x="10" y="6" width="6" height="16" fill="green" />
      <rect x="18" y="2" width="6" height="20" fill="green" />
    </svg>

    <button type="button" onclick="handleClick()">
      Click me instead of using fake link
    </button>

    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>John Doe</td>
          <td>john@example.com</td>
          <td>Developer</td>
        </tr>
      </tbody>
    </table>
  </main>

  <footer role="contentinfo">
    <p>&copy; 2024 Company Name</p>
  </footer>
</body>
</html>
  `;
}

export function handleClick() {
  console.log('Button clicked');
}

// Preserve existing functionality
export default renderApp;