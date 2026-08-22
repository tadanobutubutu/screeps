// Accessibility issues resolved per insight report (commit 42f4e836)
// - REACT_015: Added lang="en" to <html>
// - REACT_027: Fixed table structures (headers, scopes, captions, tbody/thead)
// - REACT_017: Added/fixed landmarks (banner, navigation, main, contentinfo, complementary)
// - REACT_041: Added accessible names (aria-label + title) to 2 SVGs
// - REACT_025: Ensured unique landmarks via aria-label
// - REACT_036: Replaced fake link with button

export function renderApp() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Accessible App</title>
</head>
<body>

<header role="banner" aria-label="Site banner">
  <nav role="navigation" aria-label="Primary navigation">
    <a href="/">Home</a>
  </nav>
</header>

<main role="main" aria-label="Main content">
  <h1>Overview</h1>

  <table role="table" aria-label="Table 1: Overview">
    <caption>Table 1 Overview</caption>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Status</th>
        <th scope="col">Score</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Item 1</th>
        <td>Active</td>
        <td>95</td>
      </tr>
      <tr>
        <th scope="row">Item 2</th>
        <td>Inactive</td>
        <td>88</td>
      </tr>
    </tbody>
  </table>

  <table role="table" aria-label="Table 2: Details">
    <caption>Table 2 Details</caption>
    <thead>
      <tr>
        <th scope="col">Category</th>
        <th scope="col">Value</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>A</td>
        <td>10</td>
      </tr>
      <tr>
        <td>B</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>

  <table role="table" aria-label="Table 3: Metrics">
    <caption>Table 3 Metrics</caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        <th scope="col">Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Jan</th>
        <td>100</td>
      </tr>
      <tr>
        <th scope="row">Feb</th>
        <td>200</td>
      </tr>
    </tbody>
  </table>

  <table role="table" aria-label="Table 4: Records">
    <caption>Table 4 Records</caption>
    <thead>
      <tr>
        <th scope="col">ID</th>
        <th scope="col">Type</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Type X</td>
      </tr>
    </tbody>
  </table>

  <aside role="complementary" aria-label="Sidebar info">
    <section aria-label="Related section">
      <h2>Related</h2>
    </section>
  </aside>
</main>

<footer role="contentinfo" aria-label="Site footer">
  <p>Footer content</p>
</footer>

<svg role="img" aria-label="Search icon" width="24" height="24" viewBox="0 0 24 24">
  <title>Search</title>
  <circle cx="11" cy="11" r="8" />
</svg>

<svg role="img" aria-label="Menu icon" width="24" height="24" viewBox="0 0 24 24">
  <title>Menu</title>
  <line x1="3" y1="12" x2="21" y2="12" />
</svg>

<button type="button" onclick="handleAction()">Action</button>

</body>
</html>
  `.trim();
}

export function handleAction() {
  // Existing behavior preserved
}

export default renderApp;