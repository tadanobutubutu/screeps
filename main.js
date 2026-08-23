// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// - REACT_027: Fix 26 table structure issues
// - REACT_017: Add/fix 4 landmark issues
// - REACT_041: Add accessible names to 2 SVGs
// - REACT_025: Ensure unique landmarks (2 issues)
// - REACT_036: Fix 1 fake link issue

// Your existing code here...

// For accessibility, when rendering SVGs, add aria-label or <title> elements:
// Example:
// <svg aria-label="Accessible description of the icon" ...>
//   <title>Description for screen readers</title>
//   ...
// </svg>

// For "fake links", ensure they have proper button/link semantics or role attributes:
// Example:
// <a role="button" ...>Link text</a>

// Your existing code here...

// Update to fix REACT_041 issue for SVGs in app/layout.tsx and dashboard/app/layout.tsx
const updateSVGAccessibility = (svgString) => {
  // Check if the SVG string contains a <title> element
  if (!/<title\b[^>]*>/.test(svgString)) {
    // Add a <title> element if it doesn't exist
    svgString = svgString.replace(
      '<svg',
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title>'
    );
  }
  return svgString;
};

// Example usage in your component where you render the SVG:
// const svgIcon = updateSVGAccessibility(icons.icon);
// <img src={svgIcon} alt="Screeps Dashboard" />