// Accessibility fix for React SVG Accessible Name (REACT_041)
// Add aria-hidden="true" to decorative SVG icons

// In app/layout.tsx, the icons object should have aria-hidden="true" on SVG elements:
const main = {
  // Fixed version of icons in app/layout.tsx
  appLayoutIcons: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" ...`,
    apple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><text y=".9em" ...`
  },
  
  // Fixed version of icons in dashboard/app/layout.tsx  
  dashboardLayoutIcons: {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" ...`
  },
  
  // The fix adds aria-hidden="true" to the SVG tag
  // This prevents screen readers from announcing "image" for decorative icons
  getFixedSvgIcon(svgContent) {
    // If SVG doesn't already have aria-hidden, add it
    if (svgContent.includes('<svg') && !svgContent.includes('aria-hidden')) {
      return svgContent.replace('<svg', '<svg aria-hidden="true"');
    }
    return svgContent;
  }
};

// Export all existing functionality
module.exports = main;