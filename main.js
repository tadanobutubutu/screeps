import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div id="root">
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice Johnson</td>
            <td>Developer</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Bob Smith</td>
            <td>Designer</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>Carol Williams</td>
            <td>QA Engineer</td>
            <td>Inactive</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);