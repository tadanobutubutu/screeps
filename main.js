// Hypothetical existing code
import React from 'react';

// Existing component code that needs to be updated
const MyComponent = () => {
  // Existing code...

  // Hypothetical conflicting markers
  <<<<<<< HEAD
  // Code that is causing the accessibility issue
  <div>Content that is not accessible</div>
  =======
  // Code that is causing the accessibility issue
  <div role="alert">Content that is not accessible</div>
  >>>>>>> branch-name
  // Rest of the component...
};

// New function or change requested in the issue
const MyAccessibleTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
          <th scope="col">Column 3</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.column1}</td>
            <td>{item.column2}</td>
            <td>{item.column3}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Rest of the file...
export { MyComponent, MyAccessibleTable };