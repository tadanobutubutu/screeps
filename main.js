// Assuming this is the main.js file where the imports and exports are defined.

// Import the existing layout components
import Layout from './app/layout';
import DashboardLayout from './dashboard/app/layout';

// Export the components as needed
export { Layout, DashboardLayout };

// Update the Layout component to include aria-hidden="true" for the SVG icon
const LayoutWithAccessibleFavicon = () => {
  return (
    <Layout
      icons={{
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Icon</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
        ariaHidden: true // Adding aria-hidden="true" for accessibility
      }}
    />
  );
};

// Update the DashboardLayout component to include aria-hidden="true" for the SVG icon
const DashboardLayoutWithAccessibleFavicon = () => {
  return (
    <DashboardLayout
      icons={{
        icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><title>Icon</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
        ariaHidden: true // Adding aria-hidden="true" for accessibility
      }}
    />
  );
};

// Export the updated components
export { LayoutWithAccessibleFavicon, DashboardLayoutWithAccessibleFavicon };