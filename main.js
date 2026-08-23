// Import necessary dependencies (you may need to adjust import statements if using libraries like React Table)
import React from 'react';
import PropTypes from 'prop-types';

// Assume your table component looks something like this:
function MyTable({ data, columns }) {
  return (
    <div>
      <table id="my-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.id} scope="col">
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render table rows here */}
        </tbody>
      </table>
    </div>
  );
}

MyTable.propTypes = {
  data: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
};

export default MyTable;