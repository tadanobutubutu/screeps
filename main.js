// Add ARIA landmarks if missing
export function Layout({ children }) {
  return (
    <div>
      <header role="banner">
        {/* Header content */}
      </header>
      <main role="main">
        <MainComponent>{children}</MainComponent>
      </main>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// Add lang attribute to main component if not present
export function MainComponent({ children, ...props }) {
  return (
    <main lang="en" {...props}>
      {children}
    </main>
  );
}