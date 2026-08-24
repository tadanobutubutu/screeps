x
import * as React from 'react';
// rest of the imports and the code

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Screeps Dashboard">
  <title>Screeps Dashboard</title>
  <text y=".9em" font-size="90">🐛</text>
</svg>`;

// rest of the code

function Layout({ children }) {
    // rest of the code
    return (
        <div className="app">
            {/* rest of the children */}
            <link rel="icon" type="image/svg+xml" href={faviconSvg} />
        </div>
    );
}

export default Layout;