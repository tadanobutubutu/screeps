x
import React from 'react';

const AccessibleSVG = ({ id, src, alt }) => (
  <svg
    aria-labelledby={id}
    focusable={false}
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-2 -2 24 24"
  >
    <title id={id}>{alt}</title>
    <image href={src} width="24" height="24" />
  </svg>
);

export default AccessibleSVG;