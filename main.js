import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <main>
      {/* Existing component JSX */}

      {/* Header landmark */}
      <header>
        <h1>Accessible Component</h1>
      </header>

      {/* Navigation landmark */}
      <nav aria-label="Main navigation">
        {/* Fixed fake link issue - using proper anchor element */}
        <a href="/about">About Page</a>
        
        {/* Example SVG with accessible name */}
        <svg aria-label="Home icon" width="20" height="20" viewBox="0 0 20 20">
          <path d="M10 2L2 8v10h6v-6h4v6h6V8L10 2z" fill="currentColor" />
        </svg>
      </nav>

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
      
      {/* Example second SVG with accessible name */}
      <svg aria-label="Settings gear icon" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </main>
  );
};

// Export MyComponent
export default MyComponent;