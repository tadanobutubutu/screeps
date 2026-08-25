// main.js - Dashboard component with DataTable sub-component
import React from 'react';
import { useRef, useCallback } from 'react';
import './Dashboard.scss';

const DataTable = ({ columns, data }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index} scope="col">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            <th scope="row">{row.label}</th>
            {row.values.map((value, valIndex) => (
              <td key={valIndex}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

function Dashboard() {
  //... other Dashboard function code

  return (
    <div className="Dashboard">
      <h1>Dashboard</h1>
      <main>
        {/* Render current content inside a main for only one element */}
        {renderErrorState()}
        {renderSuccessState()}
      </main>
      {/* Keep the copyErrorFunc and fetchStats functions outside the main element */}
      <button onClick={copyErrorFunc} aria-label={'Error copy button'}>
        {/* ... */}
      </button>
      <button onClick={fetchStats} disabled={refreshing} aria-label={'Refresh button'}>
        {/* ... */}
      </button>
    </div>
  );
}

// [... other functions...]

export { DataTable };
export default Dashboard;