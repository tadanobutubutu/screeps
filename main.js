// main.js
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);

// Add this function to handle SVG accessibility
function makeSvgAccessible(svgElement: SVGSVGElement) {
  if (!svgElement.getAttribute('aria-hidden')) {
    // Add aria-label if it's not decorative
    if (!svgElement.querySelector('title') && !svgElement.querySelector('desc')) {
      svgElement.setAttribute('aria-label', 'Application icon');
    }
    // Or add aria-hidden if it's decorative
    else if (svgElement.parentElement?.tagName.toLowerCase() === 'head') {
      svgElement.setAttribute('aria-hidden', 'true');
    }
  }
}

// Call this function when the app loads
document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => makeSvgAccessible(svg as SVGSVGElement));
});

// Keep all existing exports
export * from './App';
export * from './components';
export * from './utils';