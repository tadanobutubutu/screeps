import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  {
    name: 'Username',
    selector: row => row.username,
    sortable: true,
  },
  {
    name: 'Room Name',
    selector: row => row.roomName,
    sortable: true,
  },
  // Add more columns if necessary
];

// Assuming you have a 'screeps.d.ts' definition file
// declare global {
//   namespace screeps {
//     interface RoomObject {
//       // Define your RoomObject properties here
//     }
//   }
// }

// Replace _ with appropriate props
const row = ({ id, username, roomName } /*, ...props */) => {
  return (
    <tr key={id}>
      <td>{username}</td>
      <td>{roomName}</td>
      {/* Add any additional elements if necessary */}
    </tr>
  );
};

export const MyTable = () => {
  // Assuming you have data fetching logic here
  const data = [/* ...Data array for the table ... */];

  return (
    <DataTable
      title="My Table"
      columns={columns}
      data={data}
      pointerOnHover
      striped
      // Add any more table properties if necessary
    />
  );
};