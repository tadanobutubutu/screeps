// Hypothetical main.js content with accessibility fixes

import React from 'react';
import ReactDOM from 'react-dom';

// Assuming there's a table component causing React Table Structure issues
const MyTable = ({ data }) => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Age</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Assuming there's an SVG component causing React SVG Accessible Name issues
const MySVG = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <title>Accessible SVG</title>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  );
};

// Assuming there's a link component causing React Fake Link issues
const MyLink = ({ children, href }) => {
  return (
    <a href={href} aria-label="Link to external resource">
      {children}
    </a>
  );
};

const App = () => {
  return (
    <div>
      <MyTable data={[{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]} />
      <MySVG />
      <MyLink href="https://example.com">Visit Example</MyLink>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));