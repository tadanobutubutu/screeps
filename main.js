import React from 'react';

const MyTableComponent = () => {
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
        {/* Table rows would go here */}
      </tbody>
    </table>
  );
};

const MainContent = () => {
  return (
    <main>
      <MyTableComponent />
      <button id="unrotate">rotate back</button>
    </main>
  );
};

const App = () => {
  return (
    <div>
      <MainContent />
    </div>
  );
};

export default App;