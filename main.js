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
// The rest of your main.js code...  
// (original code continues here)