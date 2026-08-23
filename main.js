import React from 'react';
import { useTable } from 'react-table';

// Accessibility-related components
const Logo = () => <img src="/logo.svg" alt="Accessible Name for Logo" />;
const MenuIcon = () => <img src="/menu.svg" alt="Accessible Name for Menu Icon" />;
const FixedLink = () => (
  <a href="#" onClick={() => console.warn('Fake Link clicked')}>
    Fake Link
  </a>
);

// Function to add an accessible name to SVGs
const addAccessibleNameToSVG = (svgString) => {
  return svgString.replace('<svg', '<svg aria-label="Screeps Dashboard"');
};

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

  // Initialize the React Table hook
  const { getHeaderGroups, getRowProps, getCellProps, columns: allColumns } = useTable({ columns });

  // Container with language attribute and unique id for accessibility
  const containerId = 'mainContent-unique';
  const htmlAttributes = {
    lang: 'en',
    id: containerId,
  };

  return (
    <div {...htmlAttributes}>
      {/* Landmarks */}
      <header id="banner">Header</header>
      <main id="mainContent">
        {/* Accessible table structure */}
        <table aria-label="Accessible Table">
          <thead>
            <tr>
              {allColumns.map(column => (
                <th key={column.id} scope="col">
                  {column.render?.('Header') ?? column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allColumns.map(row => (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add updated table components and accessibility elements */}
        <Logo />
        <MenuIcon />
        <FixedLink />
        {children}

        {/* Update the SVGs in the icons to be accessible */}
        <script>
          const icons = {
            icon: addAccessibleNameToSVG(`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>`),
          };
        </script>
      </main>
      <footer>Footer</footer>
    </div>
  );
}