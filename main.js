// dashboard/app/layout.tsx

import React from 'react';

const SVG_FAVICON = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y=".9em" font-size="90">🐛</text><svg aria-hidden="true"/>`;

function Layout({ children }) {
// ...
  return (
    <div>
      {/* Your existing layout structure here */}
      <link rel="icon" type="image/svg+xml" href={SVG_FAVICON} />
    </div>
  );
}

export default Layout;