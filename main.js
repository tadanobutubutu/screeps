tsx
// Add an accessible name to the favicon in app/layout.tsx
import React from 'react';

// existing code here ...

function App() {
  return (
    <div className="App">
      {/* add aria-label to favicon */}
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='50' font-size='40'>F</text></svg>" aria-label="Favicon" />
      {/* existing code here ... */}
    </div>
  );
}

export default App;

// no changes needed in dashboard/app/layout.tsx