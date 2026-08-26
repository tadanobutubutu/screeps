// Import external package for internationalization
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

// Main functional component
const Main = ({ data }) => {
  // Address critical issue: React Language Attribute
  // Wrap all child nodes in a top-level Lang tag
  return (
    <div lang="en">
      {/* Rest of the code as before */}
    </div>
  );
};

// Table component with proper role, headers, and accessibility properties
// (Adjust as needed to fit your existing table structure)
const Table = ({ data }) => {
  return (
    <table role="grid" aria-label="My Table">
      {/* ... add thead, tbody, and tr/th/td structure depending on data structure ... */}
      {/* Address warning issue: React Table Structure */}
      {/* Ensure the table headers have associated scope attributes */}
      {/* ... adjust row and cell structure to add scope="col" to headers ... */}
    </table>
  );
};

// Prop types for the Main and Table components
Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({ /* data structure */ })).isRequired,
};

export default Main;
export { Table };