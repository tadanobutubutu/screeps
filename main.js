// Import the SVG component
import reactLogo from './react.svg';

// Create a custom SVG component with an accessible name
const AccessibleReactLogo = () => {
  return (
    <svg>
      {/* Include existing SVG code */}
      <title>React Logo</title>
      {/* Replace the original SVG export with the new accessible SVG component */}
      {reactLogo}
    </svg>
  );
};

// Export the new accessible SVG component
export default AccessibleReactLogo;