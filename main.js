import './docs/dependency-graph.html';

const MyComponent = () => {
  return (
    <div>
      {/* Add lang attribute to support screen readers */}
      <html lang="en">
        {/* Add proper landmark structure */}
        <body>
          <header role="banner">
            {/* Header content */}
          </header>
          <main role="main">
            {/* Main content */}
          </main>
          <footer role="contentinfo">
            {/* Footer content */}
          </footer>
        </body>
      </html>
    </div>
  );
};

export default MyComponent;