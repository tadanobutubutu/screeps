import React from 'react';

const App = () => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Age</th>
            <th scope="col">City</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John</td>
            <td>30</td>
            <td>New York</td>
          </tr>
          <tr>
            <td>Jane</td>
            <td>25</td>
            <td>Los Angeles</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default App;