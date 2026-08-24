// Assuming this is the structure of the icons object
const icons = {
  icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
  apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
};

// Function to create an SVG element with aria-label
function createAccessibleSVG(data, label) {
  return `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>${label}</title><text y=%22.9em%22 font-size=%2290%22>${label}</text></svg>`;
}

// Update the icons object with aria-label
icons.icon = createAccessibleSVG(icons.icon, 'Screeps Dashboard');
icons.apple = createAccessibleSVG(icons.apple, 'Screeps Dashboard');

// Output the updated icons object
console.log(icons);