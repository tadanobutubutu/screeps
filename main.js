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
      <Table data={data} />
    </div>
  );
};

// Table component with proper role, headers, and accessibility properties
const Table = ({ data }) => {
  if (!data || data.length === 0) {
    return null;
  }

  const headers = Object.keys(data[0]);

  return (
    <table role="grid" aria-label="My Table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <td key={cellIndex}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Prop types for the Main and Table components
Main.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Main;