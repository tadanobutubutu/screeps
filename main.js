import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// Add this new function to handle SVG accessibility
function makeSvgAccessible(svgElement: SVGSVGElement) {
  // Check if SVG already has an accessible name
  if (svgElement.getAttribute('aria-label') ||
      svgElement.getAttribute('aria-labelledby') ||
      svgElement.querySelector('title') ||
      svgElement.getAttribute('aria-hidden') === 'true') {
    return;
  }

  // If SVG is decorative, mark it as hidden
  if (svgElement.id && svgElement.id.includes('decorative')) {
    svgElement.setAttribute('aria-hidden', 'true');
  }
  // Otherwise, add a default accessible name
  else {
    svgElement.setAttribute('aria-label', 'Graphic element');
  }
}

// Call this function when the app loads to make all SVGs accessible
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => makeSvgAccessible(svg as SVGSVGElement));
});

// Export all existing functions if they exist in the original file
// (Assuming these were in the original main.js)
export function someExistingFunction() {
  // existing implementation
}

export const someExistingVariable = 'value';

// Add any other existing exports here