// Assuming the SVGs are being imported like this:
import logoSvg from './assets/logo.svg';
import metadataSvg from './assets/metadata.svg';


// And used in components like this:
import React from 'react';

const Logo = () => (
  <svg {...logoSvg.props} role="img" aria-label="Company Logo" />
);

const Metadata = () => (
  <svg {...metadataSvg.props} role="img" aria-label="Page Metadata" />
);

// The rest of your main.js code...