import React from 'react';
import ReactDOM from 'react-dom/client';

<<<<<<< HEAD
function main() {
  // Existing code that should be preserved
  ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
}
main();
=======
function main() {
  // Enhanced navigation logic
  const navigationRef = React.useRef(null);
  const handleNavigateBack = React.useCallback(() => {
    window.history.back();
  }, []);

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App navigateBack={handleNavigateBack} />
    </React.StrictMode>
  );
}
>>>>>>> feature/nav-back-bttn
main();