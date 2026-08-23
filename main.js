tsx
import React from 'react';

const favicon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-hidden="true" // Added for decorative SVG
  >
    <title>Screeps Dashboard</title>
    <text y=".9em" font-size="90">🐛</text>
  </svg>
);

...
// rest of your code here
...

export default function Layout({ children }) {
  ...
  return (
    <>
      ...
      {favicon} // Added the favicon component
      ...
    </>
  );
}