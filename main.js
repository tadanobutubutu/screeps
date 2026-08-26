// main.js
// React application entry point

import React from 'react';
import { createRoot } from 'react-dom/client';

// Ensure the document language attribute is set for accessibility
document.documentElement.lang = 'en';

const container = document.getElementById('root');
const root = createRoot(container);

function App() {
  return (
    <div>
      {/* Your React application content */}
    </div>
  );
}

root.render(<App />);

export default App;