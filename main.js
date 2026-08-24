// Assuming this is the content that builds the layout files
// I need the actual contents to provide the exact fix

// Based on the issue, the fix would involve modifying how SVGs are generated
// to include aria-hidden="true"

// For now, here's a template of what the fix might look like:
module.exports = {
  // ... existing exports
  
  // Modified function to generate accessible SVGs
  generateFaviconSVG: function() {
    return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text></svg>';
  }
  
  // ... other existing exports
};