// Main application entry point
import { AppLayout } from './app/layout';

// Layout component with accessibility fix applied
const AppLayout = () => {
  return (
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true">
        <path d="M0 0 L10 10 L20 0" />
      </svg>
    </div>
  );
};

export default AppLayout;