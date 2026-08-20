// main.js
// [Your existing code here]

// Add the HTML lang attribute to the root element
document.documentElement.lang = 'en';

// Remove duplicate Icon default export - kept named Icon component instead
export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="App favicon"
      >
        <title>App favicon</title>
        <rect width="32" height="32" rx="8" fill="#3B82F6" />
        <path
          d="M8 24V8L16 20L24 8V24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    {
      ...size,
    }
  );
}

// reusable Icon component with accessible name
export function Icon({ className = '' }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Application logo"
    >
      <title>Application logo</title>
      <path
        d="M4 20V4L12 16L20 4V20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Add landmark roles to main layout components
export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div role="main">
      {children}
    </div>
  );
}

// Add proper table structure for data tables
export function DataTable({ headers, rows }: { headers: string[], rows: any[][] }) {
  return (
    <table role="table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
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

// Add proper landmark for navigation
export function Navigation({ children }: { children: React.ReactNode }) {
  return (
    <nav role="navigation" aria-label="Main navigation">
      {children}
    </nav>
  );
}

// Add accessible name for SVG elements
export function AccessibleSVG({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <svg role="img" aria-label={title}>
      <title>{title}</title>
      {children}
    </svg>
  );
}

// Add fake link replacement for interactive elements
export function InteractiveElement({ onClick, children }: { onClick: () => void, children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
      {children}
    </button>
  );
}