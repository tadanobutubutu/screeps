// Existing code before conflict markers
// ...

// Changes requested in the issue
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>App Icon</title><text y=%22.9em%22 font-size=%2290%22>🍏</text></svg>',
  // Add aria-label to the SVGs for accessibility
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text><desc>Screeps Dashboard Icon</desc></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>App Icon</title><text y=%22.9em%22 font-size=%2290%22>🍏</text><desc>App Icon</desc></svg>',
};

// Existing code after conflict markers
// ...

// Updated main.js content