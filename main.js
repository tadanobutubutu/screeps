import React from 'react';
import PropTypes from 'prop-types';

// TODO: Address any missing required exports
// REACT_015: Add lang attribute

const Main = ({ children, title, lang = 'en' }) => {
  return (
    <main lang={lang}>
      {title && <h1>{title}</h1>}
      {children}
    </main>
  );
};

Main.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  lang: PropTypes.string,
};

// Adding the missing required exports
export { Main, PropTypes };

// Function to count dependencies
const countDependencies = (dependencies) => {
  if (!dependencies || typeof dependencies !== 'object') {
    return 0;
  }
  return Object.keys(dependencies).length;
};

export { countDependencies };

export default Main;