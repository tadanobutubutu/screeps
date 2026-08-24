// Assuming the following import structure:
// import icons from './path-to-icon-file';

// Update the icons object to include an `aria-label` attribute
const icons = {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>', // Original SVG
    iconAccessible: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Dashboard%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>', // Updated SVG with aria-label
    apple: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>', // Original SVG
    appleAccessible: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-label=%22Screeps Apple Icon%22><title>Screeps Apple Icon</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>', // Updated SVG with aria-label
};

// Export the updated icons object
export default icons;