import React from 'react';

function App() {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Alice</td>
            <td>Developer</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Bob</td>
            <td>Designer</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Charlie</td>
            <td>Manager</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default App;