tsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, NavLink, Button } from 'reactstrap';

// ... existing imports ...

const AppLayout = ({ content }) => {
  // ... existing code ...

  // Update favicon SVG with accessible name
  const faviconSvg = (
    <svg
      aria-label="Screeps Dashboard"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <title>Screeps Dashboard</title>
      <text y=".9em" font-size="90">🐛</text>
    </svg>
  );

  // Replace your icon object in icons array with updated hasIcon function
  const hasIcon = (iconName) => {
    // ... your existing code with updated faviconSvg ...
  };

  // ... rest of the code ...

  return (
    // ... existing JSX ..
  );
};

export default AppLayout;