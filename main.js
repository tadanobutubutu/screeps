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

/**
 * Renders an index view with a list of items.
 * @param {Array} items - Array of items to display in the index view
 * @param {Object} options - Configuration options for the index view
 * @param {string} options.title - Title for the index view
 * @param {Function} options.renderItem - Function to render individual items
 * @param {string} options.emptyMessage - Message to display when no items exist
 * @param {string} options.lang - Language attribute for the main element
 * @returns {JSX.Element} The rendered index view component
 */
const renderIndexView = (items, options = {}) => {
  const {
    title = 'Index',
    renderItem = (item, index) => (
      <li key={item.id || index}>{item.name || item.title || JSON.stringify(item)}</li>
    ),
    emptyMessage = 'No items to display',
    lang = 'en'
  } = options;

  const itemList = items && items.length > 0 ? (
    <ul>
      {items.map((item, index) => renderItem(item, index))}
    </ul>
  ) : (
    <p>{emptyMessage}</p>
  );

  return (
    <Main lang={lang} title={title}>
      {itemList}
    </Main>
  );
};

// Adding the missing required export
export { Main, PropTypes, updateTitle, renderIndexView };

export default Main;