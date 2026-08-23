import React from 'react';
import { useFetch } from 'hooks/useFetch'; // Existing import
import Table from 'components/Table'; // Existing import

const Main = () => {
  // Existing code

  const { data, error } = useFetch('/api/data'); // Existing useFetch call

  // New function added for accessibility improvement
  const handleTableFocus = (event) => {
    const table = event.target.closest('table');
    if (table) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        firstRow.focus(); // Adding keyboard focus to the first row of the table for accessibility
      }
    }
  };

  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div>
      {/* Existing JSX code */}
      <Table
        data={data}
        onTableFocus={handleTableFocus} // Adding an accessibility improvement by handling table focus
      />
      {/* More JSX code */}
    </div>
  );
};

export default Main; // Exporting the Main component