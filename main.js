// main.js

// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New changes requested in the issue
// Add aria-label to the SVGs in app/layout.tsx and dashboard/app/layout.tsx

// Function to add aria-label attribute to SVG elements
function addAriaLabelToSVG(svgString, label) {
  if (!svgString || typeof svgString !== 'string') {
    return svgString;
  }
  
  // Check if aria-label already exists
  if (svgString.includes('aria-label')) {
    return svgString;
  }
  
  // Add aria-label to the opening svg tag
  return svgString.replace(
    /<svg([^>]*)>/i,
    `<svg$1 aria-label="${label}">`
  );
}

// Example of how to add aria-label to the SVG in app/layout.tsx
const layoutApp = () => {
  // ... (Preserve existing code)

  const icons = {
    // ... (Preserve existing icons)

    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...</svg>',
    apple: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...</svg>'
  };

  // Apply aria-label to icons
  const iconsWithAria = {};
  for (const [key, svg] of Object.entries(icons)) {
    const label = key === 'icon' ? 'Screeps Dashboard' : 'Apple Icon';
    iconsWithAria[key] = addAriaLabelToSVG(svg, label);
  }

  // ... (Preserve existing code)
  
  return iconsWithAria;
};

// Example of how to add aria-label to the SVG in dashboard/app/layout.tsx
const dashboardLayout = () => {
  // ... (Preserve existing code)

  const icons = {
    // ... (Preserve existing icons)

    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" ...</svg>',
    apple: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Apple Icon</title><text y="0.9em" ...</svg>'
  };

  // Apply aria-label to icons
  const iconsWithAria = {};
  for (const [key, svg] of Object.entries(icons)) {
    const label = key === 'icon' ? 'Screeps Dashboard' : 'Apple Icon';
    iconsWithAria[key] = addAriaLabelToSVG(svg, label);
  }

  // ... (Preserve existing code)
  
  return iconsWithAria;
};

// ... (Preserve all other existing code, exports, and functions)

// Export functions
module.exports = {
  layoutApp,
  dashboardLayout,
  addAriaLabelToSVG
};

// Output the complete updated main.js content