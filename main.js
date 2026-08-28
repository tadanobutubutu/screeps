//Main.jsx
import React from 'react';

const Main = ({ children }) => {
  // Ensuring that all children passed to the <main> component are wrapped in a <div> to provide a landmark
  const wrappedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      // Assuming the child is not already a div or another landmark element, wrap it in a div
      if (!['div', 'header', 'footer', 'nav', 'main', 'article', 'section'].includes(child.type)) {
        return <div>{child}</div>;
      }
    }
    return child;
  });

  return (
    <main>{wrappedChildren}</main>
  );
};

export default Main;