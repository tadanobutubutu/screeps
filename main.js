import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Add accessibility attributes to SVG in layout files
const faviconSvg = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* SVG content would go here */}
  </svg>
);

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preserve all existing exports
export { faviconSvg };