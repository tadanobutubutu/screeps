// main.js
import React from 'react';
import { createRoot } from 'react-dom/client';

// Existing code remains unchanged
// ... (all your current exports and functions)

// Add accessible names to SVGs
const FaviconSVG = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <title>Application Favicon</title>
    {/* Your existing SVG paths */}
  </svg>
);

const MetadataSVG = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <title>Metadata Icon</title>
    {/* Your existing SVG paths */}
  </svg>
);

// Replace the problematic SVGs in your layout components
// For app/layout.tsx:
export const AppLayout = () => (
  <div>
    <MetadataSVG />
    {/* Rest of your layout */}
  </div>
);

// For dashboard/app/layout.tsx:
export const DashboardLayout = () => (
  <div>
    <FaviconSVG />
    {/* Rest of your layout */}
  </div>
);

// All other existing exports remain unchanged
// ... (rest of your current code)