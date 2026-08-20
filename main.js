tsx
// Example component before adding <main>
import React from 'react';

const MyComponent = ({ children }) => {
  return (
    <div>
      {/* ... other content ... */}
      {children}
      {/* ... other content ... */}
    </div>
  );
};

// Example component after adding <main>
import React from 'react';

const MyComponent = ({ children }) => {
  return (
    <main>
      {/* ... other content ... */}
      {children}
      {/* ... other content ... */}
    </main>
  );
};