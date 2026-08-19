// Assuming the SVGs are being imported like this:
import logoSvg from './assets/logo.svg';
import metadataSvg from './assets/metadata.svg';

// And used in components like this:
import React from 'react';

const Logo = () => (
  <svg {...logoSvg.props} aria-label="Company Logo" />
);

const Metadata = () => (
  <svg {...metadataSvg.props} aria-label="Page Metadata" />
);

// New component for the unrotate button
const UnrotateButton = ({ onClick }) => (
  <button
    id="unrotate"
    onClick={onClick}
    aria-label="Rotate back"
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      color: 'inherit',
      textDecoration: 'underline'
    }}
  >
    rotate back
  </button>
);

// The rest of your main.js code...