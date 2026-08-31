import React from 'react';
import PropTypes from 'prop-types';

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

const updateTitle = (newTitle) => {
  // Placeholder implementation
};

export { Main, PropTypes, updateTitle };
export default Main;