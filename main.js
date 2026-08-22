import React from 'react';
import { HTMLAttributes, ReactElement } from 'react';

// Utility function to fix language attribute on non-accessible elements
function reactLanguageAttributeFix(element) {
  if (element && element.props && element.props.lang) {
    console.warn('Language attribute detected on non-accessible element');
    return React.cloneElement(element, { lang: undefined });
  }
  return element;
}

// Recursive function to fix language attributes in a tree of children
function fixLanguageAttributes(children) {
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      let fixedChild = reactLanguageAttributeFix(child);
      if (child.props && child.props.children) {
        fixedChild = React.cloneElement(fixedChild, {
          children: fixLanguageAttributes(child.props.children)
        });
      }
      return fixedChild;
    }
    return child;
  });
}

// Function to remove duplicate <main> elements
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

// Enhanced table component with proper role
const EnhancedTable = ({ children }) => {
  return React.cloneElement(children, { role: 'table' });
};

// Accessible table component using semantic HTML
const Table = ({ children }) => {
  return (
    <table aria-label="Accessible Table">
      <thead>
        <tr>
          <th>Header 1</th>
          <th>Header 2</th>
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

// Landmarks component with unique structure
const Landmarks = ({ children }) => {
  const processedChildren = removeDuplicateMainElements(children);
  return (
    <>
      <header id="banner">Header</header>
      <main id="mainContent">{processedChildren}</main>
      <footer>Footer</footer>
    </>
  );
};

// Accessible SVG components
const Logo = () => <img src="/logo.svg" alt="Accessible Name for Logo" />;
const MenuIcon = () => <img src="/menu.svg" alt="Accessible Name for Menu Icon" />;

// Fixed link component
const FixedLink = () => (
  <a href="#" onClick={() => console.warn('Fake Link clicked')}>
    Fake Link
  </a>
);

// Main component with accessibility features
const Main = ({ children }) => {
  const htmlAttributes: HTMLAttributes<HTMLDivElement> = {
    lang: 'en',
  };

  // Process children to fix language attributes and enhance accessibility
  const processedChildren = fixLanguageAttributes(children);

  return (
    <div {...htmlAttributes}>
      <Landmarks>
        <EnhancedTable>
          <Table id="existingTable">...</Table>
        </EnhancedTable>
        <Table id="updatedTable">...</Table>
        {Logo()}
        {MenuIcon()}
        {FixedLink}
        {processedChildren}
      </Landmarks>
    </div>
  );
};

export default React.memo(Main);