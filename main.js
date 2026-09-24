import React from 'react';
import PropTypes from 'prop-types';

// REACT_015: Add lang attribute

const Main = ({ children, title, lang = 'en' }) => {
  // Code for Main component with accessibility improvements
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

const updateTitle = (newTitle) => {
  // Placeholder implementation
};

export { Main, PropTypes, updateTitle };
export default Main;