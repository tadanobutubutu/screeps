// ... (existing code and exports)

// REACT_041: Add accessible names to 2 SVGs
import React from 'react';

const Svg1 = () => (
  <svg data-testid="svg1" aria-hidden="true" focusable="false" aria-labelledby="svg1-title">
    {/* SVG Code */}
    <title id="svg1-title">My SVG 1</title>
  </svg>
);

const Svg2 = () => (
  <svg data-testid="svg2" aria-hidden="true" focusable="false" aria-labelledby="svg2-title">
    {/* SVG Code */}
    <title id="svg2-title">My SVG 2</title>
  </svg>
);

export { Svg1, Svg2 };