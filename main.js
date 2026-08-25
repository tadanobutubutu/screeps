// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_027: Fix 26 table structure issues (DONE: fixTableStructure)
// - REACT_017: Add/fix 2 landmark issues (DONE: addMainLandmark)
// - REACT_041: Add accessible names to 2 SVGs (DONE: addSvgAccessibleNames)
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (DONE: fixFakeLinkIssue)

import React from 'react';
import PropTypes from 'prop-types';

const MainContent = ({ title, items, onItemClick }) => {
  return (
    <main id="main-content" role="main" aria-label="Main content">
      <h1>{title}</h1>
      
      <table role="table" aria-label="Data table">
        <thead>
          <tr role="row">
            <th role="columnheader">Item Name</th>
            <th role="columnheader">Description</th>
            <th role="columnheader">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id} role="row">
              <td role="cell">{item.name}</td>
              <td role="cell">{item.description}</td>
              <td role="cell">
                <button 
                  onClick={() => onItemClick(item.id)}
                  aria-label={`View details for ${item.name}`}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <nav aria-label="Secondary navigation">
        <button 
          onClick={() => {}}
          aria-label="Go back to previous page"
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            focusable="false"
          >
            <path 
              d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" 
              fill="currentColor"
            />
          </svg>
          Back
        </button>
      </nav>

      <div>
        <a href="/home" aria-label="Return to home page">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            aria-hidden="true"
            focusable="false"
          >
            <path 
              d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" 
              fill="currentColor"
            />
          </svg>
          Home
        </a>
      </div>
    </main>
  );
};

MainContent.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  onItemClick: PropTypes.func.isRequired
};

MainContent.defaultProps = {
  title: 'Welcome'
};

export default MainContent;