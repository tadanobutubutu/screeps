import React from 'react';

const MainComponent = () => {
  return (
    <div>
      <h1>Welcome to the Site</h1>
      <table>
        <tr>
          <td>Row 1, Cell 1</td>
          <td>Row 1, Cell 2</td>
        </tr>
        <tr>
          <td>Row 2, Cell 1</td>
          <td>Row 2, Cell 2</td>
        </tr>
      </table>
      <a href="https://example.com">Link</a>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" />
      </svg>
    </div>
  );
};

export default MainComponent;