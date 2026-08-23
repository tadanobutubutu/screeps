// main.js

// Import existing code from the current main.js file
import existingCode from './existingCode';

// Import the layout components that need the SVGs updated
import LayoutComponent from './app/layout';
import DashboardLayoutComponent from './dashboard/app/layout';

// Update the LayoutComponent to include aria-hidden="true" in the SVGs
const LayoutComponentWithAccessibleSVGs = () => {
  return (
    <LayoutComponent icons={{
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>'
    }} />
  );
};

// Update the DashboardLayoutComponent to include aria-hidden="true" in the SVGs
const DashboardLayoutComponentWithAccessibleSVGs = () => {
  return (
    <DashboardLayoutComponent icons={{
      icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22 aria-hidden=%22true%22><title>Screeps Dashboard</title><text y=%22.9em%22 font-size=%2290%22>🐛</text></svg>',
    }} />
  );
};

// Export the updated components
export { LayoutComponentWithAccessibleSVGs as LayoutComponent, DashboardLayoutComponentWithAccessibleSVGs as DashboardLayoutComponent, existingCode };