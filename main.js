import React from 'react';
import ReactDOM from 'react-dom/client';

// Resolve conflict: add lang attribute to <html>
document.documentElement.lang = 'en';

// Existing component definition
function App() {
  return <div>Hello World</div>;
}

// Render the app into the root container
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Export for testing and further use
export default App;