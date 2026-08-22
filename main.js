import React from 'react';
import ReactDOM from 'react-dom/client';

const TableComponent = () => {
  return (
    <div>
      <h1>Sample Table</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Column 1</th>
            <th scope="col">Column 2</th>
            <th scope="col">Column 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row 1 Col 1</td>
            <td>Row 1 Col 2</td>
            <td>Row 1 Col 3</td>
          </tr>
          <tr>
            <td>Row 2 Col 1</td>
            <td>Row 2 Col 2</td>
            <td>Row 2 Col 3</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TableComponent />);