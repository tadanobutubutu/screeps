// main.js - Next.js configuration with accessibility improvements

module.exports = {
  reactStrictMode: true,
  
  // Accessibility-related configuration
  eslint: {
    // Ensure ESLint catches accessibility issues
    ignoreDuringBuilds: false,
  },
  
  // Ensure proper HTML lang attribute is set
  // This helps screen readers understand the language
};

// Custom App wrapper with accessibility improvements
export default function App({ Component, pageProps }) {
  return (
    <>
      {/* 
        Accessibility Note: 
        The lang attribute should be set on the <html> element.
        This is typically done in pages/_document.js for Next.js:
        
        <html lang="en">
          <Head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          </Head>
          <body>
            <Main />
            <NextScript />
          </body>
        </html>
        
        Ensure your _document.js includes the lang="en" attribute.
      */}
      
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

// Accessible Layout component
function Layout({ children }) {
  return (
    <>
      {/* Skip to main content link for keyboard users */}
      <a 
        href="#main-content"
        className="skip-link"
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
          e.currentTarget.style.left = '10px';
          e.currentTarget.style.top = '10px';
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
        }}
      >
        Skip to main content
      </a>
      
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>
      
      <main 
        id="main-content" 
        role="main"
        tabIndex="-1"
      >
        {children}
      </main>
      
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </>
  );
}

// Example accessible table component
export function AccessibleTable({ headers, rows }) {
  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th 
              key={index} 
              scope="col"
              id={`header-${index}`}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td 
                key={cellIndex}
                headers={`header-${cellIndex}`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Example accessible SVG component
export function AccessibleIcon({ children, label, className }) {
  return (
    <svg 
      className={className}
      aria-label={label}
      role="img"
      focusable="false"
    >
      {children}
    </svg>
  );
}

// Example accessible link (real link vs button)
export function AccessibleLink({ href, onClick, children, isButton }) {
  if (isButton || !href) {
    return (
      <button 
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    );
  }
  
  return (
    <a href={href}>
      {children}
    </a>
  );
}