import React from 'react';
import PropTypes from 'prop-types';

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
  // This function should update the title of the Main component.
  // For example, it could be a method that sets a state or a prop that controls the title.
  // Placeholder implementation:
  console.log(`Updating title to: ${newTitle}`);
};

// Adding the missing required export
export { Main, PropTypes };

export default Main;
export { Main, updateTitle };