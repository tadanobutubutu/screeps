// main.js
import { createRoot } from 'react-dom/client';
import App from './App';

// Add accessibility attributes to SVG elements
const enhancedSvg = (props) => (
  <svg
    {...props}
    aria-hidden={props['aria-hidden'] || true}
    role={props.role || 'img'}
  />
);

// Render the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

export default enhancedSvg;