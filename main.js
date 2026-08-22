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

// Fix the language attribute on non-accessible elements
function reactLanguageAttributeFix(element) {
  if (element && element.props && element.props.lang) {
    console.warn('Language attribute detected on non-accessible element');
    delete element.props.lang;
  }
}

// Add new function for react-table structure
const EnhancedTable = ({ children }) => {
  return React.cloneElement(children, { role: 'table' });
};

// Enhanced table with ARIA attributes support
const EnhancedTableWithARIA = ({ children }) => {
  const tableElement = React.cloneElement(children, { role: 'table' });

  const addARIAAttributes = (element, attributes) => {
    Object.keys(attributes).forEach((key) => {
      element.props[key] = attributes[key];
    });
  };

  return tableElement;
};

// Main component
function Main({ children }) {
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
  const { getHeaderGroups, getRowProps, getCellProps, columns: allColumns } = useTable(
    { columns }
  );

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
        <EnhancedTable>
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
        </EnhancedTable>

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

module.exports = {
  Main,
  EnhancedTable,
  EnhancedTableWithARIA,
  reactLanguageAttributeFix,
  Logo,
  MenuIcon,
  FixedLink
};