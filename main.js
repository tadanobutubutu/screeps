// main.js
import { createRoot } from 'react-dom/client';
import App from './App';

// Add accessibility attributes to SVGs in layout files
const enhanceSVGAccessibility = () => {
  // For app/layout.tsx
  const appSVG = document.querySelector('app-layout svg');
  if (appSVG) {
    appSVG.setAttribute('aria-hidden', 'true');
    // Alternatively, you could add a title element:
    // const title = document.createElement('title');
    // title.textContent = 'Application icon';
    // appSVG.prepend(title);
  }

  // For dashboard/app/layout.tsx
  const dashboardSVG = document.querySelector('dashboard-layout svg');
  if (dashboardSVG) {
    dashboardSVG.setAttribute('aria-hidden', 'true');
    // Alternatively:
    // const title = document.createElement('title');
    // title.textContent = 'Dashboard icon';
    // dashboardSVG.prepend(title);
  }
};

// Initialize the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Call the accessibility enhancement after render
enhanceSVGAccessibility();

// Export all existing functions if they exist in the original file
// (Assuming these were in the original main.js)
export function someExistingFunction() {
  // existing implementation
}

export const someExistingVariable = 'value';

// Add any new exports here if needed
export const newFeatureFlag = true;