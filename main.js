// main.js - Accessibility Fixed Version

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
      <header role="banner">
        {navigation}
      </header>

      <div className="layout-container">
        <aside aria-label="Secondary content" role="complementary">
          {sidebar}
        </aside>

        <MainContent>
          {children}
        </MainContent>
      </div>

      <footer role="contentinfo">
        <p>Footer content</p>
      </footer>
    </div>
  );
}

// New function to handle fake links
export function FakeLink({ children, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`fake-link ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {children}
    </button>
  );
}

// New function to handle SVG accessibility
export function AccessibleSVG({ children, title, desc, className = '' }) {
  return (
    <svg className={className} aria-hidden={!title && !desc}>
      {title && <title>{title}</title>}
      {desc && <desc>{desc}</desc>}
      {children}
    </svg>
  );
}

export default {
  MainContent,
  Navigation,
  AccessibleTable,
  AccessibleIcon,
  AccessibleButton,
  AccessibleLink,
  PageLayout,
  FakeLink,
  AccessibleSVG
};