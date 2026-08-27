// main.js - Fixed accessibility issues

// 1. REACT_015: Add lang attribute to HTML element
// This is typically set in your _document.js or HTML file, but here's how it should look:
// <html lang="en">

// 2. REACT_017 & REACT_025: Proper landmark structure
export function AppLayout({ children }) {
  return (
    <>
      {/* Only ONE main landmark per page */}
      <header role="banner">
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>
      </header>
      
      <main id="main-content" role="main">
        {children}
      </main>
      
      <footer role="contentinfo">
        <p>© 2024 Company</p>
      </footer>
    </>
  );
}

// 3. REACT_027: Proper table structure with headers
export function DataTable({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Email</th>
          <th scope="col">Role</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.role}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// 4. REACT_041: SVG with accessible name
export function Icon({ name, size = 24 }) {
  const icons = {
    search: (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        aria-hidden="false"
        role="img"
        aria-label={`Search icon`}
      >
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
    menu: (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        aria-hidden="false"
        role="img"
        aria-label="Menu icon"
      >
        <rect x="3" y="5" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="11" width="18" height="2" fill="currentColor"/>
        <rect x="3" y="17" width="18" height="2" fill="currentColor"/>
      </svg>
    )
  };
  
  return icons[name] || null;
}

// 5. REACT_036: Fix fake links - use buttons for actions, links for navigation
export function Navigation() {
  return (
    <nav aria-label="User actions">
      {/* ✅ CORRECT: Use button for actions */}
      <button type="button" onClick={() => alert('Open settings')}>
        Settings
      </button>
      
      {/* ✅ CORRECT: Use link for navigation */}
      <a href="/dashboard">Go to Dashboard</a>
      
      {/* ❌ WRONG (Fake Link) - Don't do this: */}
      {/* <a onClick={handleClick}>Click me</a> */}
    </nav>
  );
}

// 6. Accessibility helper components
export function VisuallyHidden({ children }) {
  return (
    <span style={{
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: '0',
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      border: '0'
    }}>
      {children}
    </span>
  );
}

// 7. Skip link for keyboard navigation
export function SkipLink() {
  return (
    <a 
      href="#main-content" 
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
      onFocus={(e) => {
        e.currentTarget.style.position = 'fixed';
        e.currentTarget.style.top = '10px';
        e.currentTarget.style.left = '10px';
        e.currentTarget.style.width = 'auto';
        e.currentTarget.style.height = 'auto';
        e.currentTarget.style.padding = '10px 20px';
        e.currentTarget.style.background = '#000';
        e.currentTarget.style.color = '#fff';
        e.currentTarget.style.zIndex = '9999';
      }}
      onBlur={(e) => {
        e.currentTarget.style.position = 'absolute';
        e.currentTarget.style.left = '-9999px';
        e.currentTarget.style.width = '1px';
        e.currentTarget.style.height = '1px';
      }}
    >
      Skip to main content
    </a>
  );
}

// 8. Proper landmark wrapper
export function PageContent({ title, children }) {
  return (
    <article>
      <h1>{title}</h1>
      <div>{children}</div>
    </article>
  );
}

// Example of fixing common landmark issues
export function AccessibilityFixes() {
  return (
    <div>
      <SkipLink />
      <AppLayout>
        <PageContent title="Dashboard">
          <DataTable data={[]} />
          <Navigation />
        </PageContent>
      </AppLayout>
    </div>
  );
}

export default {
  AppLayout,
  DataTable,
  Icon,
  Navigation,
  VisuallyHidden,
  SkipLink,
  PageContent,
  AccessibilityFixes
};