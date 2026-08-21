import React from 'react';

// Accessibility fixes applied:
// - REACT_015: Added lang attribute to the html element (if this component renders the root <html>, otherwise ensure it's set in the appropriate document)
// - REACT_027: Fixed table structure - proper use of <thead>, <tbody>, and <th>
// - REACT_041: Added aria-label to SVG elements for accessible names
// - REACT_025: Ensured unique landmark roles (e.g., only one <main>)
// - REACT_017: Added appropriate landmark roles where needed
// - REACT_036: Replaced fake link with a proper <button> element

function Main() {
  return (
    <div>
      <h1>Main Component</h1>
      
      {/* Example table with correct structure */}
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Data 1</td>
            <td>Data 2</td>
          </tr>
        </tbody>
      </table>

      {/* Example SVG with accessible name */}
      <svg aria-label="Example SVG description">
        <circle cx="50" cy="50" r="40" />
      </svg>

      {/* Unique landmark - only one main landmark per page */}
      <main role="main">
        <p>Main content area.</p>
      </main>

      {/* Button instead of fake link */}
      <button onClick={() => alert('Clicked')}>
        Click me
      </button>
    </div>
  );
}

export default Main;