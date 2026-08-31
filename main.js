import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address any missing required exports
// REACT_015: Add lang attribute

const calculateSum = (a, b) => {
  return a + b;
};

const Main = ({ children, title, lang = 'en' }) => {
  // Extracted from the conflicting code and added for consistency
  // ensuring the Main component accepts lang attribute

  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

// Combined the two exports from both sides of the merge conflict
Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Added the missing required exports
export { Main, calculateSum };

// Replaced the default export with the combined export
export default Main;