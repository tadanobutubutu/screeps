import React from 'react';
import { Table } from 'nextui';

const MyTable = () => {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age', scope: 'col' }, // Added scope="col" to resolve REACT_027 warning
    { key: 'location', label: 'Location' },
  ];

  const rows = [
    { name: 'Alice', age: 25, location: 'New York' },
    { name: 'Bob', age: 30, location: 'Los Angeles' },
    { name: 'Charlie', age: 35, location: 'Chicago' },
  ];

  return (
    <Table>
      <Table.Header columns={columns} />
      <Table.Body data={rows} />
    </Table>
  );
};

export default MyTable;