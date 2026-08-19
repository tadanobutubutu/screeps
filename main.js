export function MainContent({ children, className = '' }) {
  return (
    <main
      className={className}
      id="main-content"
    >
      {children}
    </main>
  );
}

export function Navigation({ items = [], ariaLabel = 'Main navigation' }) {
  return (
    <nav aria-label={ariaLabel}>
      <ul role="list">
        {items.map((item, index) => (
          <li key={index}>
            <a href={item.href} aria-current={item.isActive ? 'page' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function AccessibleTable({ headers = [], rows = [], caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">
              {header}
            </th>
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

// Additional table component for dependency graph
const DependencyGraphTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Source File</th>
          <th scope="col">Target File</th>
          <th scope="col">Dependency Type</th>
        </tr>
      </thead>
      <tbody>
        {/* Table rows with dependency data */}
      </tbody>
    </table>
  );
};

export { DependencyGraphTable };

export function AccessibleIcon({ icon: Icon, label, className = '' }) {
  return (
    <span className={className} aria-hidden="false">
      <Icon
        aria-label={label}
        role="img"
      />
    </span>
  );
}

export function AccessibleButton({
  children,
  onClick,
  variant = 'primary',
  ariaLabel,
  disabled = false,
  type = 'button'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}

export function AccessibleLink({
  children,
  href,
  ariaLabel,
  className = ''
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </a>
  );
}

export function PageLayout({
  children,
  sidebar,
  navigation
}) {
  return (
    <div lang="en">
      <header>
        {navigation}
      </header>

      <div className="layout-container">
        <aside aria-label="Secondary content">
          {sidebar}
        </aside>

        <MainContent>
          {children}
        </MainContent>
      </div>

      <footer>
        <p>Footer content</p>
      </footer>
    </div>
  );
}

export default {
  MainContent,
  Navigation,
  AccessibleTable,
  AccessibleIcon,
  AccessibleButton,
  AccessibleLink,
  PageLayout
};