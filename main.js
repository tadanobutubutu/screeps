// app/layout.tsx
import { StrictMode } from "react";
import Layout from "./Layout";

export default function App() {
  return (
    <StrictMode>
      <Layout />
    </StrictMode>
  );
}

// Update to include aria-label for accessibility in the SVGs
import React from 'react';

const Layout = () => {
  return (
    <div>
      {/* Assuming the SVG used for the favicon is within Layout */}
      <link rel="icon" href="/favicon.ico" aria-label="Screeps Dashboard" />
      {/* Other content... */}
    </div>
  );
};

export default Layout;