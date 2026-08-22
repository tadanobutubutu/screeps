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

// Function to remove duplicate <main> elements from children
const removeDuplicateMainElements = (children) => {
  const mainElements = React.Children.toArray(children).filter(
    (child) => child.type === 'main'
  );
  if (mainElements.length > 1) {
    console.warn('Duplicate <main> elements detected. Only one <main> element is allowed.');
    return React.cloneElement(mainElements[0], { children: mainElements.slice(1) });
  }
  return children;
};
module.exports.removeDuplicateMainElements = removeDuplicateMainElements;

// Function to add lang attribute to the root element (run once)
function addLangAttributeToRoot() {
  const rootElement = document.documentElement;
  if (!rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}
// Call the function once (e.g., on module load)
addLangAttributeToRoot();

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
        <FixedLink>
          {children}
        </FixedLink>
      </main>
      <footer>Footer</footer>
    </div>
  );
}

// Export EnhancedTable if needed
const EnhancedTable = ({ children }) => {
  // Uncomment this line when available, mainElement
  // const { mainElement } = require('./mainElement');
  return React.cloneElement(children, { role: 'table' });
};
module.exports.EnhancedTable = EnhancedTable;