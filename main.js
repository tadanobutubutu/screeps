import React from 'react';

const Table = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// New function for checking link and button accessibility
const checkAccessibility = () => {
  const links = document.getElementsByTagName('a');
  const buttons = document.getElementsByTagName('button');

  const isAccessible = (element) => {
    if (!element) return false;
    // Implement your accessibility checks here
    // For example, check if the link has a valid href or button has an appropriate type
    // This is a placeholder check
    return true;
  };

  const allAccessible = Array.from(links).every(isAccessible) &&
                        Array.from(buttons).every(isAccessible);

  return allAccessible;
};

export default Table;