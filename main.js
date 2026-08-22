import React from 'react';
import { useTable } from 'react-table';

// Existing exports
export function existingFunction1() {
  // existing implementation
}
export const existingConst1 = 'existing value';

// New required exports
export function newFunction1() {
  // new implementation
}
export const newConst1 = 'new value';

// Fix the language attribute on non-accessible elements
function reactLanguageAttributeFix(element) {
  if (element && element.props && element.props.lang) {
    console.warn('Language attribute detected on non-accessible element');
    delete element.props.lang;
  }
}

// Add new function for react-table structure
const EnhancedTable = ({ children }) => {
  // Uncomment this line when available, mainElement
  // const { mainElement } = require('./mainElement');
  return React.cloneElement(children, { role: 'table' });
};
export { EnhancedTable };

// Remove duplicate main elements
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
export { removeDuplicateMainElements };

// Add lang attribute to the root element
function addLangAttributeToRoot() {
  const rootElement = document.documentElement;
  if (!rootElement.hasAttribute('lang')) {
    rootElement.setAttribute('lang', 'en');
  }
}

// Execute immediate fixes
(() => {
  // Ensure lang attribute on root
  addLangAttributeToRoot();
})();

// Accessibility-related components
const Logo = () => <img src="/logo.svg" alt="Accessible Name for Logo" />;
const MenuIcon = () => <img src="/menu.svg" alt="Accessible Name for Menu Icon" />;
const FixedLink = () => (
  <a href="#" onClick={() => console.warn('Fake Link clicked')}>
    Fake Link
  </a>
);

// Main component
export function Main() {
  // Define columns (up to 26)
  const columns = [
    { Header: 'constants' },
    { Header: 'roomManager' },
    { Header: 'spawnManager' },
    { Header: 'towerManager' },
    { Header: 'builder' },
    // ...additional columns
  ];

  const {
    getHeaderGroups,
    getRowProps,
    getCellProps,
    columns: allColumns,
  } = useTable({ columns });

  // Add lang attribute to root element
  addLangAttributeToRoot();

  return (
    <div {...htmlAttributes}>
      <header id="banner">Header</header>
      <main id="mainContent">
        <table aria-label="Accessible Table">
          <thead>
            <tr>
              {allColumns.map((column) => (
                <th key={column.id} scope="col">
                  {column.render?.('Header') ?? column.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allColumns.map((row) => (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Logo />
        <MenuIcon />
        <FixedLink>Fake Link</FixedLink>
      </main>
      <footer>Footer</footer>
    </div>
  );
}