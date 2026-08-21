// app/layout.tsx
import React from 'react';
import Logo from './Logo';

function App() {
  return (
    <>
      <Logo />
      {/* other components */}
    </>
  );
}

// dashboard/app/layout.tsx
import React from 'react';
import Logo from './Logo';
import Favicon from './Favicon';

function DashboardLayout() {
  return (
    <>
      <Favicon />
      {/* other components */}
    </>
  );
}

// Logo.js
function Logo() {
  return (
    <svg>
      {/* SVG code */}
    </svg>
  );
}

// Favicon.js
function Favicon() {
  return (
    <svg>
      {/* SVG code */}
    </svg>
  );
}