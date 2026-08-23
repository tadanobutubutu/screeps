import React from 'react';
import { useTable } from 'react-table';

// Accessibility-related components
const Logo = () => <img src="/logo.svg" alt="Accessible Name for Logo" />;
const MenuIcon = () => <img src="/menu.svg" alt="Accessible Name for Menu Icon" />;
const FixedLink = () => (
  <button type="button" onClick={() => console.warn('Fake Link clicked')}>
    Fake Link
  </button>
);

// Main component
export default function Main({ children }) {
  // Define the columns for the table (26 columns total)
  const columns = [
    { Header: 'constants' },
    { Header: 'roomManager' },
    { Header: 'spawnManager' },
    { Header: 'towerManager' },
    { Header: 'builder' },
    // ... (additional columns up to 26 total)
  ];

  // Sample data for the table
  const data = [
    { id: 1, constants: 'value1', roomManager: 'value2', spawnManager: 'value3', towerManager: 'value4', builder: 'value5' },
    // ... (additional rows)
  ];

  // Initialize the React Table hook
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    columns: allColumns,
  } = useTable({ columns, data });

  // Container with language attribute and unique id for accessibility
  const containerId = 'mainContent-unique';
  const htmlAttributes = {
    lang: 'en',
    id: containerId,
  };

  return (
    <div {...htmlAttributes}>
      {/* Landmarks - proper landmark structure */}
      <header id="banner">Header</header>
      <main id="mainContent">
        {/* Accessible table structure */}
        <table {...getTableProps()} aria-label="Accessible Table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()} scope="col">
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Add updated table components and accessibility elements */}
        <Logo />
        <MenuIcon />
        <FixedLink />
        {children}
      </main>
      <footer>Footer</footer>
    </div>
  );
}