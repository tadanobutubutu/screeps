tsx
import React from 'react';

// Current content
const AppLayout = ({ children }) => {
  return <body>{children}</body>;
};

// Proposed solution
const AppLayout = ({ children }) => {
  return <body><main>{children}</main></body>;
};