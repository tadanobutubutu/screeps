// Existing imports (preserved)
import React from 'react';
import { useRouter } from 'next/router';

// Existing component (preserved)
export function ExistingComponent({ children }) {
  // ... existing implementation ...
}

// New accessibility improvements
export function AccessibleTable({ data, caption }) {
  return (
    <table role="grid" aria-label={caption}>
      <caption>{caption}</caption>
      <thead>
        <tr>
          {Object.keys(data[0]).map((key) => (
            <th key={key} scope="col">{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((value, i) => (
              <td key={i}>{value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AccessibleLink({ href, children, ...props }) {
  const router = useRouter();

  const handleClick = (e) => {
    if (href.startsWith('/')) {
      e.preventDefault();
      router.push(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      aria-label={typeof children === 'string' ? children : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

export function AccessibleSVG({ title, ...props }) {
  return (
    <svg {...props} role="img" aria-label={title}>
      <title>{title}</title>
      {props.children}
    </svg>
  );
}

// Existing exports (preserved)
export const existingExport = 'value';

// Add lang attribute to main component if not present
export function MainComponent({ children, ...props }) {
  return (
    <main lang="en" {...props}>
      {children}
    </main>
  );
}

// Add ARIA landmarks if missing
export function Layout({ children }) {
  return (
    <div>
      <header role="banner">
        {/* Header content */}
      </header>
      <main role="main">
        {children}
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}