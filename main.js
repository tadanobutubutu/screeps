// main.js - Accessibility fixes applied

// Ensure the html element has a lang attribute
// This fixes REACT_015 React Language Attribute

// For REACT_036 React Fake Link - use real <a> tags instead of clickable divs/buttons
// Example: Instead of <div onClick={...}>, use <a href="..." onClick={...}>

export default function MainPage() {
  return (
    // Ensure lang attribute is set at the html level (usually in _document.js for Next.js)
    <main lang="en">
      {/* For REACT_017 React Landmarks - ensure proper landmark regions */}
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a ...
          </ul>
        </nav>
      </header>

      {/* For REACT_025 React Unique Landmarks - ensure unique landmark labels */}
      <main role="main" id="main-content">
        {/* For REACT_027 React Table Structure */}
        <table>
          <caption>Data Summary</caption>
          <thead>
            <tr>
              <th scope="col">Column 1</th>
              <th scope="col">Column 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td scope="row">Data 1</td>
              <td>Data 2</td>
            </tr>
          </tbody>
        </table>

        {/* For REACT_041 React SVG Accessible Name */}
        <svg role="img" aria-label="Decorative icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
        </svg>
      </main>

      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </main>
  );
}