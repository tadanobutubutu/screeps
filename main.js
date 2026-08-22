// main.js – Updated to address accessibility issues from the insight report
// ---------------------------------------------------------------------------
// TODO: Address accessibility issues from insight report:
//   - REACT_015: Add lang attribute to HTML element
//   - REACT_017: Add/fix 4 landmark issues
//   - REACT_041: Add accessible names to 2 SVGs
//   - REACT_025: Ensure unique landmarks (2 issues)
//   - REACT_036: Fix 1 fake link issue
// ---------------------------------------------------------------------------

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Helper to generate a unique numeric suffix for dynamically created IDs
const _uniqueId = (() => {
  let counter = 0;
  return () => ++counter;
})();

function buildHtml() {
  // -------------------------------------------------------------------------
  // 1️⃣  REACT_015 – Add `lang="en"` to the root HTML element
  // -------------------------------------------------------------------------
  // 2️⃣  REACT_017 – Provide four distinct landmark roles (banner, navigation,
  //               main, complementary/contentinfo) with unique IDs or ARIA
  //               labels where needed.
  // -------------------------------------------------------------------------
  // 3️⃣  REACT_041 – Give the two SVG icons accessible names via aria‑label or
  //               <title> elements.
  // -------------------------------------------------------------------------
  // 4️⃣  REACT_025 – Guarantee that each landmark has a unique identifier.
  // -------------------------------------------------------------------------
  // 5️⃣  REACT_036 – Replace the placeholder “#” link with a meaningful URL.
  // -------------------------------------------------------------------------

  const uniqueHeaderId = `header-${_uniqueId()}`;
  const uniqueNavId = `navigation-${_uniqueId()}`;
  const uniqueMainId = `main-content-${_uniqueId()}`;
  const uniqueFooterId = `footer-${_uniqueId()}`;

  // Example SVG icons with accessible names
  const energySvg = `
    <svg role="img" aria-label="Energy level chart" viewBox="0 0 100 100">
      <rect width="80" height="80" fill="#4caf50"/>
      <title>Energy Capacity</title>
    </svg>`;

  const cpuSvg = `
    <svg role="img" aria-label="CPU usage gauge" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="40" fill="#ff9800"/>
      <title>CPU Usage</title>
    </svg>`;

  // -------------------------------------------------------------------------
  // Build the HTML string – preserve any existing markup or templating logic.
  // -------------------------------------------------------------------------
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Screeps Dashboard</title>
      <style>
        body {font-family: Arial, sans-serif; margin:0; padding:0;}
        header, nav, main, footer {padding:1rem; background:#f4f4f4;}
        main {display:flex; flex-direction:column; gap:2rem;}
        svg {margin-right:0.5rem;}
      </style>
    </head>
    <body>
      <!-- 1️⃣ Landmark: Banner -->
      <header id="${uniqueHeaderId}" role="banner">
        <h1>Screeps Dashboard</h1>
      </header>

      <!-- 2️⃣ Landmark: Navigation -->
      <nav id="${uniqueNavId}" role="navigation">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/metrics">Metrics</a></li>
          <li><a href="/logs">Logs</a></li>
        </ul>
      </nav>

      <!-- 3️⃣ Landmark: Main -->
      <main id="${uniqueMainId}" role="main">
        <section aria-label="Metrics">
          <h2>Metrics Overview</h2>
          ${energySvg}
        </section>

        <section aria-label="System Logs">
          <h2>System Logs</h2>
          ${cpuSvg}
        </section>
      </main>

      <!-- 4️⃣ Landmark: Complementary (footer) -->
      <footer id="${uniqueFooterId}" role="contentinfo">
        <p>© ${new Date().getFullYear()} Screeps Community</p>
      </footer>

      <!-- 5️⃣ Fix fake link – replace placeholder href="#" with an actual link -->
      <a href="/dashboard" style="display:block;margin-top:1rem;">Open Dashboard</a>
    </body>
    </html>
  `;
}

// Serve the built HTML for the root route
app.get('/', (req, res) => {
  res.send(buildHtml());
});

// Optional: serve static assets if needed
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});

module.exports = app; // Export for potential unit testing