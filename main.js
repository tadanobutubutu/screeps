// Import required libraries for React.
import React from 'react';
import PropTypes from 'prop-types';

// Import custom library for handling accessibility table headers as requested by REACT_027 rule.
// You may have to install this package (e.g., `npm install react-accessible-table`).
import { useTable, useSortBy } from 'react-table';

// Avoid using 'notice' and 'you' as variable names, which are causing syntax errors.
// Update the printNotice() and printYou() functions using a different variable name.

const MyTable = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { sortBy },
  } = useTable({ columns, data }, useSortBy);

  // Enable accessibility features for table headers as requested by REACT_027 rule.
  return (
    <table {...getTableProps()} aria-labelledby="table- Titel">
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th
                id={`header-${column.id}`}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

MyTable.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
};

export default MyTable;

// Add the missing en-US language attribute to the div as requested by the insight code analysis.
const ContentInEnglish = () => (
  <div lang="en-US">Content in English</div>
);

// Add missing landmarks as requested by REACT_017
export const MyLandmarks = () => (
  <>
    <header role="banner" id="landmarks-banner">
      <h1 role="heading" id="landmarks-title">My Landmarks</h1>
    </header>
  </>
);