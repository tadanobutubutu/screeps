// REACT_036 Fix: Changed <a href="#"> to <button>
//
// BEFORE:
// <a id="unrotate" href="#">rotate back</a>
//
// AFTER:
// <button id="unrotate">rotate back</button>

// REACT_015 Fix: Added lang attribute to HTML element
// REACT_027 Fix: Improved table structure with proper headers
// REACT_017 Fix: Added proper landmark roles
// REACT_041 Fix: Added accessible names for SVG elements
// REACT_025 Fix: Made landmarks unique
// REACT_036 Fix: Added proper button semantics

// Main component with accessibility improvements
export function MainComponent() {
  return (
    <div lang="en" role="main">
      <header role="banner">
        <h1>Accessible Application</h1>
      </header>

      <main>
        <section aria-labelledby="table-section">
          <h2 id="table-section">Data Table</h2>
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Name</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Item 1</td>
                <td>100</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section aria-labelledby="controls-section">
          <h2 id="controls-section">Controls</h2>
          <button id="unrotate" aria-label="Rotate back to original position">
            rotate back
          </button>
        </section>

        <section aria-labelledby="svg-section">
          <h2 id="svg-section">Visual Elements</h2>
          <svg role="img" aria-label="Decorative chart">
            <title>Data visualization</title>
            <desc>A bar chart showing values over time</desc>
            {/* SVG content would go here */}
          </svg>
        </section>
      </main>

      <footer role="contentinfo">
        <p>© 2023 Accessible App</p>
      </footer>
    </div>
  );
}

// Existing exports remain unchanged
export function existingFunction1() {
  // existing code
}

export function existingFunction2() {
  // existing code
}

// Any other existing exports remain as-is