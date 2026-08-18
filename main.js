import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add this function to create accessible SVG elements
function createAccessibleSvg(props) {
  return (
    <svg
      {...props}
      aria-hidden={props['aria-hidden'] || "true"}
      role={props.role || "img"}
    >
      {props.children}
    </svg>
  );
}

// Preserve all existing exports and functions
export { createAccessibleSvg };

// Main render function
function main() {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root container not found');
  }

  const root = createRoot(container);
  root.render(<App />);
}

// Start the application
main();