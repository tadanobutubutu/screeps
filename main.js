import React from 'react';
import PropTypes from 'prop-types';

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
  // This function should update the title of the Main component.
  // For example, it could be a method that sets a state or a prop that controls the title.
  // Placeholder implementation:
  console.log(`Updating title to: ${newTitle}`);
};

export { Main, PropTypes };

export default Main;
export { Main, updateTitle };