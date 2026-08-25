import React from 'react';

const MyTableComponent = ({ headers, rows }) => {
  return (
    <table>
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
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Assuming there's a component that uses the <a> tag with a hash-only href
const RotateBackButton = () => {
  const handleRotateBack = () => {
    // Perform the action that was intended to happen when the link was clicked
    console.log('Rotating back...');
    // For example, if you were changing the URL to a specific state or page,
    // you would update the URL or the component's state here.
  };

  return (
    <button onClick={handleRotateBack} id="unrotate">
      rotate back
    </button>
  );
};

export default MyTableComponent;
export { RotateBackButton };