// In app/layout.tsx
import React from 'react';
// ...
function Layout({ children }) {
  // ...
  return (
    // ...
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A simple react web app for testing purposes only.">
    <link rel="icon" href="/favicon.ico">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 62q17 0 31-14t14-31h-16L32 30q-28-11-43.5-26.5T0 15v44q7 0 16.5-3.5t31-17.5h16l11-17q28 10 43.5 27T32 62z"></path></svg>
    {/* ... */}
  );
}
export default Layout;

// In dashboard/app/layout.tsx
import React from 'react';
// ...
function Layout({ children }) {
  // ...
  return (
    // ...
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 30q28-10 43.5-27T64 15v11q-28 11-43.5 26.5T32 62q-17 0-31-14t-14-31h-16l-11-17q-28-10-43.5-27T0 30v-44q7 0-16.5 3.5t-31 17.5h-16z"></path></svg>
    {/* ... */}
  );
}
export default Layout;

// In docs/dependency-graph.html
// Replace the fake link with a button
<button id="unrotate">rotate back</button>