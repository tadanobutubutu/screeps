import React from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Screeps Dashboard',
  description: 'Screeps game dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <main className="flex-1" role="main">{children}</main>
      </body>
    </html>
  );
}

// Add new React 19 compatibility functions if needed
// For example, if using new React 19 features:
export function useOptimisticState(initialState) {
  const [state, setState] = React.useState(initialState);

  const updateState = (newState) => {
    setState(newState);
    // Additional optimistic state handling can be added here
  };

  return [state, updateState];
}

// Add Jest 30 compatibility functions if needed
// For example, if using new Jest 30 features:
export function createTestContext() {
  return {
    // Add any test context setup needed for Jest 30 compatibility
    // This is just a placeholder - actual implementation would depend on your test needs
    mockFunction: jest.fn(),
    testUtils: {
      // Add test utilities here
    }
  };
}

// Accessibility improvements
export function AccessibleLink({ href, children, ...props }) {
  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}

export function AccessibleButton({ onClick, children, ...props }) {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}

export function AccessibleTable({ caption, headers, data, ...props }) {
  return (
    <table {...props}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AccessibleSVG({ title, desc, children, ...props }) {
  return (
    <svg {...props} role="img" aria-labelledby={`title-${props.id} desc-${props.id}`}>
      <title id={`title-${props.id}`}>{title}</title>
      <desc id={`desc-${props.id}`}>{desc}</desc>
      {children}
    </svg>
  );
}

// New accessibility components for the React Landmarks issue
export function MainLandmark({ children, ...props }) {
  return (
    <main role="main" {...props}>
      {children}
    </main>
  );
}

export function HeaderLandmark({ children, ...props }) {
  return (
    <header role="banner" {...props}>
      {children}
    </header>
  );
}

export function FooterLandmark({ children, ...props }) {
  return (
    <footer role="contentinfo" {...props}>
      {children}
    </footer>
  );
}

export function NavigationLandmark({ children, ...props }) {
  return (
    <nav role="navigation" {...props}>
      {children}
    </nav>
  );
}

export function AsideLandmark({ children, ...props }) {
  return (
    <aside role="complementary" {...props}>
      {children}
    </aside>
  );
}