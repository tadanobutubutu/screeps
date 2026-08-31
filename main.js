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

// Adding the missing required exports
export { Main, PropTypes };

// TODO: Implement a function to count dependencies
const countDependencies = (code) => {
  const dependencyRegex = /import\s+[\w.]+ from\s+['"]([\w.]+)['"];/g;
  let match;
  let dependencyCount = 0;

  while ((match = dependencyRegex.exec(code)) !== null) {
    if (!dependencyRegex.test(code.slice(match.index))) {
      dependencyCount++;
    }
  }

  return dependencyCount;
};

export default Main;