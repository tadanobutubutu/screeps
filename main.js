// Hypothetical contents of main.js before changes
import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
  // Existing code that needs to be preserved
  return (
    <div>
      <h1>Accessible Title</h1>
      <img src="image.jpg" alt="Description of image" />
      {/* ... other components ... */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

// Hypothetical merge conflict markers
<<<<<<< HEAD
// Existing code that conflicts with accessibility improvements
const TableComponent = ({ data }) => {
  return (
    <table>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
=======
// Updated code to fix accessibility issues
const TableComponent = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td>{item.name}</td>
            <td>{item.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
>>>>>>> branch-name