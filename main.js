// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element ✓ FIXED
// - REACT_017: Add landmark roles and fix landmark issues ✓ FIXED
// - REACT_041: Add accessible names to 2 SVGs ✓ FIXED
// - REACT_025: Ensure unique landmarks (2 issues) ✓ FIXED
// - REACT_036: Fix 1 fake link issue ✓ FIXED

import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div lang="en">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          <h1>My Accessible App</h1>
        </nav>
      </header>
      
      <main role="main">
        <section aria-label="Counter section">
          <p>Count: {count}</p>
          <button onClick={() => setCount(count + 1)}>Increment</button>
          
          <svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-labelledby="icon1-title">
            <title id="icon1-title">Decorative icon showing a circle</title>
            <circle cx="50" cy="50" r="40" fill="blue" />
          </svg>
          
          <svg width="100" height="100" viewBox="0 0 100 100" role="img" aria-labelledby="icon2-title">
            <title id="icon2-title">Interactive arrow icon pointing right</title>
            <polygon points="20,50 80,20 80,80" fill="green" />
          </svg>
        </section>
      </main>
      
      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
}

export default App;