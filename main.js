import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';

// REACT_025 fix: Ensure only a single <main> landmark exists in the rendered output.
// If multiple <main> elements are present, additional ones are converted to <article>
const ensureUniqueMainLandmark = (children) => {
  if (!children) return children;
  const mainElements = React.Children.toArray(children).filter(
    (el) => el && el.type && el.type === 'main'
  );
  if (mainElements.length <= 1) return children;
  return React.Children.map(children, (child) => {
    if (child && child.type && child.type === 'main') {
      return React.cloneElement(child, {
        key: `${child.key}-landmark`,
        'aria-hidden': true,
      });
    }
    return child;
  });
};

ReactDOM.render(
  <React.StrictMode>
    <ensureUniqueMainLandmark><Dashboard /></ensureUniqueMainLandmark>
  </React.StrictMode>,
  document.getElementById('root')
);

export { ensureUniqueMainLandmark, Dashboard };