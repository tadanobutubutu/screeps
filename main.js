import { Html } from 'next/document';

// Component to address REACT_015 - React Language Attribute
function DocumentWithLang() {
  return <Html lang="en" />;
}

// Component to address REACT_017 & REACT_025 - React Landmarks & Unique Landmarks
function AccessibleLayout({ children }) {
  return (
    <div>
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation items */}
        </nav>
      </header>
      <main role="main" id="main-content">
        {children}
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// Component to address REACT_027 - React Table Structure
function AccessibleTable({ data }) {
  return (
    <table>
      <caption>Data Summary</caption>
      <thead>
        <tr>
          <th scope="col">Column 1</th>
          <th scope="col">Column 2</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.column1}</td>
            <td>{row.column2}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Component to address REACT_041 - React SVG Accessible Name
function AccessibleIcon({ name, children }) {
  return (
    <svg aria-label={name} role="img" focusable="false">
      {children}
    </svg>
  );
}

// Component to address REACT_036 - React Fake Link
function AccessibleLink({ href, children }) {
  return <a href={href}>{children}</a>;
}

// Accessible Navigation with proper landmarks
function AccessibleNav() {
  return (
    <nav role="navigation" aria-label="Primary">
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>
  );
}

// Main page component using all accessible patterns
export default function AccessiblePage() {
  const tableData = [
    { column1: 'Data 1', column2: 'Value 1' },
    { column1: 'Data 2', column2: 'Value 2' },
  ];

  return (
    <div>
      <DocumentWithLang />
      <AccessibleLayout>
        <h1>Accessibility Improved Page</h1>
        <AccessibleNav />
        <AccessibleTable data={tableData} />
        <AccessibleIcon name="Close icon">
          <path d="M10 10L20 20M20 10L10 20" />
        </AccessibleIcon>
      </AccessibleLayout>
    </div>
  );
}

// Export all components for testing
export {
  DocumentWithLang,
  AccessibleLayout,
  AccessibleTable,
  AccessibleIcon,
  AccessibleLink,
  AccessibleNav,
  AccessiblePage,
};