// main.js
// Resolved merge conflicts for REACT_017
// Added <main> landmark to wrap primary content

import React from 'react';

export default function Main({ children }) {
  return React.createElement('main', null, children);
}